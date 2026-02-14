import { Salary } from "../../domain/entities/salary";
import type { SettingsRepository } from "../ports/settingsRepository";

export class SaveSalaryUseCase {
  constructor(private readonly settingsRepo: SettingsRepository) {}

  async execute(monthlySalary: number): Promise<{ hourlyWage: number }> {
    const salary = Salary.create(monthlySalary);
    await this.settingsRepo.save({
      monthlySalary: salary.monthlySalary,
      isEnabled: true,
    });
    return { hourlyWage: salary.hourlyWage };
  }
}
