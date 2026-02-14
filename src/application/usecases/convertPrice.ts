import { Salary } from "../../domain/entities/salary";
import { convertPriceToWorkTime } from "../../domain/services/priceConverter";
import type { SettingsRepository } from "../ports/settingsRepository";

export class ConvertPriceUseCase {
  constructor(private readonly settingsRepo: SettingsRepository) {}

  async execute(price: number): Promise<string> {
    const settings = await this.settingsRepo.load();
    if (!settings) {
      throw new Error("월급이 설정되지 않았습니다");
    }
    const salary = Salary.create(settings.monthlySalary);
    const workTime = convertPriceToWorkTime(price, salary);
    return workTime.format();
  }
}
