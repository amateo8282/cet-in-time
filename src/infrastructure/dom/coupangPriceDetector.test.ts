import { describe, it, expect, beforeEach } from "vitest";
import { CoupangPriceDetector } from "./coupangPriceDetector";

describe("CoupangPriceDetector", () => {
  let detector: CoupangPriceDetector;

  beforeEach(() => {
    document.body.innerHTML = "";
    detector = new CoupangPriceDetector();
  });

  it("CSS 선택자로 가격 요소를 감지한다", () => {
    document.body.innerHTML = `
      <div class="product-offer-price">
        <span class="price-value">29,900원</span>
      </div>
    `;

    const elements = detector.detectPriceElements();
    expect(elements.length).toBeGreaterThan(0);
  });

  it("정규식 폴백으로 가격을 감지한다", () => {
    document.body.innerHTML = `
      <div class="some-unknown-class">
        <span>29,900원</span>
      </div>
    `;

    const elements = detector.detectPriceElements();
    expect(elements.length).toBeGreaterThan(0);
  });

  it("가격 요소에서 숫자를 파싱한다", () => {
    document.body.innerHTML = `<span class="price-value">29,900원</span>`;

    const elements = detector.detectPriceElements();
    expect(elements[0].price).toBe(29900);
  });

  it("콤마가 없는 가격도 파싱한다", () => {
    document.body.innerHTML = `<span>900원</span>`;

    const elements = detector.detectPriceElements();
    expect(elements[0].price).toBe(900);
  });

  it("이미 변환된 요소는 건너뛴다", () => {
    document.body.innerHTML = `
      <span data-cet-converted="true">29,900원</span>
      <span>19,900원</span>
    `;

    const elements = detector.detectPriceElements();
    expect(elements.length).toBe(1);
    expect(elements[0].price).toBe(19900);
  });

  it("배송비, 적립금 텍스트가 포함된 부모 요소는 필터링한다", () => {
    document.body.innerHTML = `
      <div class="delivery-fee">
        <span>3,000원</span>
      </div>
      <div class="reward-info">
        <span>최대 500원 적립</span>
      </div>
      <div class="product-price">
        <span>29,900원</span>
      </div>
    `;

    const elements = detector.detectPriceElements();
    // 배송비와 적립금은 필터링되어야 함
    expect(elements.length).toBe(1);
    expect(elements[0].price).toBe(29900);
  });

  it("여러 상품의 가격을 모두 감지한다", () => {
    document.body.innerHTML = `
      <ul>
        <li><span class="price-value">29,900원</span></li>
        <li><span class="price-value">15,000원</span></li>
        <li><span class="price-value">8,500원</span></li>
      </ul>
    `;

    const elements = detector.detectPriceElements();
    expect(elements.length).toBe(3);
  });
});
