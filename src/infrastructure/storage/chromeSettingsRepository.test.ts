import { describe, it, expect, vi, beforeEach } from "vitest";
import { ChromeSettingsRepository } from "./chromeSettingsRepository";

// chrome.storage.sync 모킹
const mockStorage: Record<string, unknown> = {};

const chromeMock = {
  storage: {
    sync: {
      get: vi.fn((keys: string[]) => {
        const result: Record<string, unknown> = {};
        for (const key of keys) {
          if (key in mockStorage) {
            result[key] = mockStorage[key];
          }
        }
        return Promise.resolve(result);
      }),
      set: vi.fn((items: Record<string, unknown>) => {
        Object.assign(mockStorage, items);
        return Promise.resolve();
      }),
    },
  },
};

// @ts-expect-error 테스트용 chrome 모킹
globalThis.chrome = chromeMock;

describe("ChromeSettingsRepository", () => {
  let repo: ChromeSettingsRepository;

  beforeEach(() => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
    vi.clearAllMocks();
    repo = new ChromeSettingsRepository();
  });

  it("설정을 저장한다", async () => {
    await repo.save({ monthlySalary: 3_000_000, isEnabled: true });

    expect(chromeMock.storage.sync.set).toHaveBeenCalledWith({
      monthlySalary: 3_000_000,
      isEnabled: true,
    });
  });

  it("저장된 설정을 불러온다", async () => {
    mockStorage.monthlySalary = 3_000_000;
    mockStorage.isEnabled = true;

    const result = await repo.load();

    expect(result).toEqual({ monthlySalary: 3_000_000, isEnabled: true });
  });

  it("저장된 설정이 없으면 null을 반환한다", async () => {
    const result = await repo.load();
    expect(result).toBeNull();
  });
});
