import type { SettingsDto } from "../../application/dto/settingsDto";
import type { SettingsRepository } from "../../application/ports/settingsRepository";

export class ChromeSettingsRepository implements SettingsRepository {
  async save(settings: SettingsDto): Promise<void> {
    await chrome.storage.sync.set({
      monthlySalary: settings.monthlySalary,
      isEnabled: settings.isEnabled,
    });
  }

  async load(): Promise<SettingsDto | null> {
    const result = await chrome.storage.sync.get([
      "monthlySalary",
      "isEnabled",
    ]);
    if (!result.monthlySalary) {
      return null;
    }
    return {
      monthlySalary: result.monthlySalary as number,
      isEnabled: result.isEnabled as boolean,
    };
  }
}
