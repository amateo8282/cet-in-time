// Content Script 진입점 - 쿠팡 페이지에서 가격을 근무 시간으로 변환

import { ChromeSettingsRepository } from "./infrastructure/storage/chromeSettingsRepository";
import { ConvertPriceUseCase } from "./application/usecases/convertPrice";
import { CoupangPriceDetector } from "./infrastructure/dom/coupangPriceDetector";
import { PriceReplacer } from "./infrastructure/dom/priceReplacer";

const repo = new ChromeSettingsRepository();
const convertPriceUseCase = new ConvertPriceUseCase(repo);
const detector = new CoupangPriceDetector();
const replacer = new PriceReplacer();

let observer: MutationObserver | null = null;

async function convertAllPrices(): Promise<void> {
  const settings = await repo.load();
  if (!settings || !settings.isEnabled) return;

  const priceElements = detector.detectPriceElements();

  for (const { element, price } of priceElements) {
    try {
      const formatted = await convertPriceUseCase.execute(price);
      replacer.replace(element, price, formatted);
    } catch {
      // 변환 실패 시 원본 유지
    }
  }
}

function restoreAllPrices(): void {
  const converted = document.querySelectorAll("[data-cet-converted]");
  converted.forEach((el) => replacer.restore(el));
}

// MutationObserver로 동적 콘텐츠 대응
function startObserver(): void {
  if (observer) return;

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  observer = new MutationObserver(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      convertAllPrices();
    }, 500);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// 설정 변경 메시지 수신
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SETTINGS_CHANGED") {
    if (message.isEnabled) {
      restoreAllPrices();
      convertAllPrices();
      startObserver();
    } else {
      restoreAllPrices();
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }
  }
});

// 초기 실행
async function init(): Promise<void> {
  const settings = await repo.load();
  if (settings?.isEnabled) {
    convertAllPrices();
    startObserver();
  }
}

init();
