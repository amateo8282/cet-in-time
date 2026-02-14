import { describe, it, expect, vi } from "vitest";
import { ConvertPriceUseCase } from "./convertPrice";
import type { SettingsRepository } from "../ports/settingsRepository";

function createMockRepo(monthlySalary: number | null): SettingsRepository {
  return {
    save: vi.fn().mockResolvedValue(undefined),
    load: vi.fn().mockResolvedValue(
      monthlySalary ? { monthlySalary, isEnabled: true } : null,
    ),
  };
}

describe("ConvertPriceUseCase", () => {
  it("저장된 월급으로 가격을 변환한다", async () => {
    const repo = createMockRepo(2_090_000); // 시급 10,000원
    const useCase = new ConvertPriceUseCase(repo);

    const result = await useCase.execute(15_000);

    expect(result).toBe("1시간 30분");
  });

  it("다양한 가격을 올바르게 포맷한다", async () => {
    const repo = createMockRepo(2_090_000);
    const useCase = new ConvertPriceUseCase(repo);

    expect(await useCase.execute(5_000)).toBe("30분");
    expect(await useCase.execute(10_000)).toBe("1시간");
    expect(await useCase.execute(50_000)).toBe("5시간");
  });

  it("월급 미설정 시 에러를 던진다", async () => {
    const repo = createMockRepo(null);
    const useCase = new ConvertPriceUseCase(repo);

    await expect(useCase.execute(10_000)).rejects.toThrow("월급이 설정되지 않았습니다");
  });
});
