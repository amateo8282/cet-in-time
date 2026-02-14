import { describe, it, expect } from "vitest";
import { Salary } from "./salary";

describe("Salary", () => {
  it("월급 2,090,000원에서 시급 10,000원을 계산한다", () => {
    const salary = Salary.create(2_090_000);
    expect(salary.hourlyWage).toBe(10_000);
  });

  it("월급 3,000,000원에서 시급을 계산한다", () => {
    const salary = Salary.create(3_000_000);
    // 3,000,000 / 209 = 14354.066...
    expect(salary.hourlyWage).toBeCloseTo(14354.07, 0);
  });

  it("월급 0원은 에러를 던진다", () => {
    expect(() => Salary.create(0)).toThrow();
  });

  it("음수 월급은 에러를 던진다", () => {
    expect(() => Salary.create(-100_000)).toThrow();
  });

  it("monthlySalary를 반환한다", () => {
    const salary = Salary.create(2_090_000);
    expect(salary.monthlySalary).toBe(2_090_000);
  });
});
