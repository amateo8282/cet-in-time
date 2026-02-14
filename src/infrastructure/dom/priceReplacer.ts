// DOM 가격 교체 + 원본 보존 서비스

export class PriceReplacer {
  replace(element: Element, originalPrice: number, formattedTime: string): void {
    // 원본 가격 보존
    element.setAttribute("data-cet-original", String(originalPrice));
    element.setAttribute("data-cet-converted", "true");
    element.setAttribute(
      "title",
      `원래 가격: ${originalPrice.toLocaleString()}원`,
    );

    // 원본 텍스트 보존
    const originalText = element.textContent || "";
    element.setAttribute("data-cet-original-text", originalText);

    // 변환된 시간 표시
    element.innerHTML = `<span class="cet-time-badge">${formattedTime}</span>`;
  }

  restore(element: Element): void {
    const originalText = element.getAttribute("data-cet-original-text");
    if (originalText) {
      element.textContent = originalText;
    }
    element.removeAttribute("data-cet-original");
    element.removeAttribute("data-cet-converted");
    element.removeAttribute("data-cet-original-text");
    element.removeAttribute("title");
  }
}
