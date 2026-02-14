import { describe, it, expect } from "vitest";
import { Salary } from "../entities/salary";
import { convertPriceToWorkTime } from "./priceConverter";

describe("convertPriceToWorkTime", () => {
  it("시급 10,000원 기준 15,000원을 90분으로 변환한다", () => {
    const salary = Salary.create(2_090_000); // 시급 10,000원
    const workTime = convertPriceToWorkTime(15_000, salary);
    expect(workTime.totalMinutes).toBe(90);
  });

  it("시급 10,000원 기준 10,000원을 60분으로 변환한다", () => {
    const salary = Salary.create(2_090_000);
    const workTime = convertPriceToWorkTime(10_000, salary);
    expect(workTime.totalMinutes).toBe(60);
  });

  it("시급 10,000원 기준 5,000원을 30분으로 변환한다", () => {
    const salary = Salary.create(2_090_000);
    const workTime = convertPriceToWorkTime(5_000, salary);
    expect(workTime.totalMinutes).toBe(30);
  });

  it("가격 0원은 0분을 반환한다", () => {
    const salary = Salary.create(2_090_000);
    const workTime = convertPriceToWorkTime(0, salary);
    expect(workTime.totalMinutes).toBe(0);
  });

  it("음수 가격은 에러를 던진다", () => {
    const salary = Salary.create(2_090_000);
    expect(() => convertPriceToWorkTime(-1, salary)).toThrow();
  });

  it("큰 금액도 정확히 변환한다", () => {
    const salary = Salary.create(2_090_000); // 시급 10,000원
    const workTime = convertPriceToWorkTime(1_000_000, salary);
    // 1,000,000 / 10,000 = 100시간 = 6000분
    expect(workTime.totalMinutes).toBe(6000);
  });
});
