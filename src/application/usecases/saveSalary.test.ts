import { describe, it, expect, vi } from "vitest";
import { SaveSalaryUseCase } from "./saveSalary";
import type { SettingsRepository } from "../ports/settingsRepository";

function createMockRepo(): SettingsRepository {
  return {
    save: vi.fn().mockResolvedValue(undefined),
    load: vi.fn().mockResolvedValue(null),
  };
}

describe("SaveSalaryUseCase", () => {
  it("월급을 저장하고 시급을 반환한다", async () => {
    const repo = createMockRepo();
    const useCase = new SaveSalaryUseCase(repo);

    const result = await useCase.execute(2_090_000);

    expect(repo.save).toHaveBeenCalledWith({
      monthlySalary: 2_090_000,
      isEnabled: true,
    });
    expect(result.hourlyWage).toBe(10_000);
  });

  it("0 이하 월급은 에러를 던진다", async () => {
    const repo = createMockRepo();
    const useCase = new SaveSalaryUseCase(repo);

    await expect(useCase.execute(0)).rejects.toThrow();
    await expect(useCase.execute(-100)).rejects.toThrow();
  });
});
