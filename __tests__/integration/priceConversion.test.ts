import { describe, it, expect, beforeEach, vi } from "vitest";
import { Salary } from "../../src/domain/entities/salary";
import { convertPriceToWorkTime } from "../../src/domain/services/priceConverter";
import { CoupangPriceDetector } from "../../src/infrastructure/dom/coupangPriceDetector";
import { PriceReplacer } from "../../src/infrastructure/dom/priceReplacer";
import { ConvertPriceUseCase } from "../../src/application/usecases/convertPrice";
import type { SettingsRepository } from "../../src/application/ports/settingsRepository";

// 통합 테스트: 월급 설정 -> 가격 감지 -> 변환 -> DOM 교체 전체 파이프라인

function createMockRepo(monthlySalary: number): SettingsRepository {
  return {
    save: vi.fn().mockResolvedValue(undefined),
    load: vi.fn().mockResolvedValue({ monthlySalary, isEnabled: true }),
  };
}

describe("가격 변환 통합 테스트", () => {
  const detector = new CoupangPriceDetector();
  const replacerInstance = new PriceReplacer();

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("전체 파이프라인: 월급 설정 -> 감지 -> 변환 -> DOM 교체", async () => {
    // 쿠팡 상품 리스트 HTML fixture
    document.body.innerHTML = `
      <div class="search-product">
        <span class="price-value">29,900원</span>
      </div>
      <div class="search-product">
        <span class="price-value">15,000원</span>
      </div>
    `;

    const repo = createMockRepo(3_000_000);
    const useCase = new ConvertPriceUseCase(repo);

    // 가격 감지
    const prices = detector.detectPriceElements();
    expect(prices.length).toBe(2);

    // 변환 + DOM 교체
    for (const { element, price } of prices) {
      const formatted = await useCase.execute(price);
      replacerInstance.replace(element, price, formatted);
    }

    // DOM 검증
    const convertedElements = document.querySelectorAll("[data-cet-converted]");
    expect(convertedElements.length).toBe(2);

    // 원본 보존 확인
    expect(convertedElements[0].getAttribute("data-cet-original")).toBe("29900");
    expect(convertedElements[1].getAttribute("data-cet-original")).toBe("15000");
  });

  describe("다양한 가격대 변환 정확도", () => {
    const testCases = [
      { price: 1_000, salary: 2_090_000, expected: "6분" },
      { price: 10_000, salary: 2_090_000, expected: "1시간" },
      { price: 29_900, salary: 3_000_000, expected: "2시간 5분" },
      // 100,000 / 10,000 = 10시간 = 600분. 600/480=1일 나머지 120분=2시간
      { price: 100_000, salary: 2_090_000, expected: "1일 2시간" },
      // 1,000,000 / 10,000 = 100시간 = 6000분. 6000/480=12일 나머지 240분=4시간
      { price: 1_000_000, salary: 2_090_000, expected: "12일 4시간" },
      // 10,000,000 / 10,000 = 1000시간 = 60000분. 60000/12540=4개월 나머지 9840분. 9840/480=20일 나머지 240분=4시간
      { price: 10_000_000, salary: 2_090_000, expected: "4개월 20일 4시간" },
    ];

    for (const { price, salary: monthlySalary, expected } of testCases) {
      it(`월급 ${monthlySalary.toLocaleString()}원 기준 ${price.toLocaleString()}원 = ${expected}`, () => {
        const salary = Salary.create(monthlySalary);
        const workTime = convertPriceToWorkTime(price, salary);
        expect(workTime.format()).toBe(expected);
      });
    }
  });

  it("변환 후 복원이 올바르게 동작한다", async () => {
    document.body.innerHTML = `<span class="price-value">29,900원</span>`;

    const repo = createMockRepo(3_000_000);
    const useCase = new ConvertPriceUseCase(repo);

    const prices = detector.detectPriceElements();
    const { element, price } = prices[0];
    const formatted = await useCase.execute(price);
    replacerInstance.replace(element, price, formatted);

    // 변환 확인
    expect(element.getAttribute("data-cet-converted")).toBe("true");

    // 복원
    replacerInstance.restore(element);
    expect(element.textContent).toBe("29,900원");
    expect(element.getAttribute("data-cet-converted")).toBeNull();
  });

  it("계획의 검증 시나리오: 월급 3,000,000원 기준 29,900원 = 약 2시간 5분", () => {
    const salary = Salary.create(3_000_000);
    // 3,000,000 / 209 = 14,354.07원/시간
    expect(salary.hourlyWage).toBeCloseTo(14354.07, 0);

    const workTime = convertPriceToWorkTime(29_900, salary);
    // 29,900 / 14,354.07 = 2.083시간 = 125분 = 2시간 5분
    expect(workTime.format()).toBe("2시간 5분");
  });
});
