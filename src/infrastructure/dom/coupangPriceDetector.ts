// 쿠팡 페이지에서 가격 요소를 감지하는 인프라 서비스

export interface DetectedPrice {
  element: Element;
  price: number;
}

// 쿠팡 가격 관련 CSS 선택자
const PRICE_SELECTORS = [
  ".price-value",
  ".product-offer-price .total-price strong",
  ".product-offer-price",
  ".base-price",
  "span.price",
  ".sale .price-value",
];

// 비상품 가격 필터링 키워드 (부모 요소 검사)
const EXCLUDE_KEYWORDS = ["delivery", "shipping", "reward", "적립", "배송", "할인쿠폰"];

// 가격 패턴: 숫자(콤마 포함) + 원
const PRICE_REGEX = /(\d{1,3}(,\d{3})*)\s*원/;

export class CoupangPriceDetector {
  detectPriceElements(): DetectedPrice[] {
    const results: DetectedPrice[] = [];
    const seen = new Set<Element>();

    // 1차: CSS 선택자로 감지
    for (const selector of PRICE_SELECTORS) {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        if (this.shouldSkip(el) || seen.has(el)) continue;
        const price = this.extractPrice(el);
        if (price !== null) {
          results.push({ element: el, price });
          seen.add(el);
        }
      }
    }

    // 2차: 정규식 폴백 - 텍스트 노드에서 "N원" 패턴 감지
    if (results.length === 0) {
      this.walkTextNodes(document.body, (el) => {
        if (this.shouldSkip(el) || seen.has(el)) return;
        const price = this.extractPrice(el);
        if (price !== null) {
          results.push({ element: el, price });
          seen.add(el);
        }
      });
    }

    return results;
  }

  private shouldSkip(el: Element): boolean {
    // 이미 변환된 요소 건너뛰기
    if (el.getAttribute("data-cet-converted") === "true") return true;

    // 비상품 가격 부모 요소 필터링
    let parent: Element | null = el.parentElement;
    let depth = 0;
    while (parent && depth < 5) {
      const className = parent.className?.toLowerCase() || "";
      const textContent = parent.textContent?.toLowerCase() || "";
      for (const keyword of EXCLUDE_KEYWORDS) {
        if (className.includes(keyword) || textContent.includes(keyword)) {
          // 부모의 텍스트가 필터 키워드를 포함하면 건너뛰기
          // 단, 자기 자신의 텍스트만으로는 충분하지 않으므로 className 우선 체크
          if (className.includes(keyword)) return true;
        }
      }
      parent = parent.parentElement;
      depth++;
    }
    return false;
  }

  private extractPrice(el: Element): number | null {
    const text = el.textContent?.trim() || "";
    const match = text.match(PRICE_REGEX);
    if (!match) return null;
    const priceStr = match[1].replace(/,/g, "");
    const price = parseInt(priceStr, 10);
    return isNaN(price) || price <= 0 ? null : price;
  }

  private walkTextNodes(root: Element, callback: (el: Element) => void): void {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let node: Node | null = walker.currentNode;
    while (node) {
      const el = node as Element;
      const text = el.textContent?.trim() || "";
      // 자식이 없는(리프) 요소에서만 가격 감지
      if (el.children.length === 0 && PRICE_REGEX.test(text)) {
        callback(el);
      }
      node = walker.nextNode();
    }
  }
}
