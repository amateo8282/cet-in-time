import type { SettingsDto } from "../dto/settingsDto";

export interface SettingsRepository {
  save(settings: SettingsDto): Promise<void>;
  load(): Promise<SettingsDto | null>;
}
