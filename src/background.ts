// Background Service Worker - 설치 시 기본값 설정

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["monthlySalary"], (result) => {
    if (!result.monthlySalary) {
      // 기본값: 최저임금 기준 월급 (2024년 최저시급 9,860원 * 209시간)
      chrome.storage.sync.set({
        monthlySalary: 2_060_740,
        isEnabled: false,
      });
    }
  });
});
