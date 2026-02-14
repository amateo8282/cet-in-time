import { describe, it, expect, beforeEach } from "vitest";
import { PriceReplacer } from "./priceReplacer";

describe("PriceReplacer", () => {
  let replacer: PriceReplacer;

  beforeEach(() => {
    document.body.innerHTML = "";
    replacer = new PriceReplacer();
  });

  it("가격을 근무 시간으로 교체한다", () => {
    document.body.innerHTML = `<span>29,900원</span>`;
    const el = document.querySelector("span")!;

    replacer.replace(el, 29900, "2시간 59분");

    expect(el.textContent).toContain("2시간 59분");
  });

  it("원본 가격을 data-cet-original에 보존한다", () => {
    document.body.innerHTML = `<span>29,900원</span>`;
    const el = document.querySelector("span")!;

    replacer.replace(el, 29900, "2시간 59분");

    expect(el.getAttribute("data-cet-original")).toBe("29900");
  });

  it("data-cet-converted 속성을 설정한다", () => {
    document.body.innerHTML = `<span>29,900원</span>`;
    const el = document.querySelector("span")!;

    replacer.replace(el, 29900, "2시간 59분");

    expect(el.getAttribute("data-cet-converted")).toBe("true");
  });

  it("title 속성에 원본 가격 툴팁을 표시한다", () => {
    document.body.innerHTML = `<span>29,900원</span>`;
    const el = document.querySelector("span")!;

    replacer.replace(el, 29900, "2시간 59분");

    expect(el.getAttribute("title")).toBe("원래 가격: 29,900원");
  });

  it("원본 가격으로 복원할 수 있다", () => {
    document.body.innerHTML = `<span>29,900원</span>`;
    const el = document.querySelector("span")!;

    replacer.replace(el, 29900, "2시간 59분");
    replacer.restore(el);

    expect(el.textContent).toBe("29,900원");
    expect(el.getAttribute("data-cet-converted")).toBeNull();
  });
});
