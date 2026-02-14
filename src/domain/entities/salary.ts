// 월급 엔티티 - 월급에서 시급을 계산

const MONTHLY_WORKING_HOURS = 209; // 한국 법정 월 근로시간

export class Salary {
  private constructor(
    public readonly monthlySalary: number,
    public readonly hourlyWage: number,
  ) {}

  static create(monthlySalary: number): Salary {
    if (monthlySalary <= 0) {
      throw new Error("월급은 0보다 커야 합니다");
    }
    const hourlyWage = monthlySalary / MONTHLY_WORKING_HOURS;
    return new Salary(monthlySalary, hourlyWage);
  }
}
