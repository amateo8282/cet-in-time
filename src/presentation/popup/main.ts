// Popup 진입점
import { ChromeSettingsRepository } from "../../infrastructure/storage/chromeSettingsRepository";
import { SaveSalaryUseCase } from "../../application/usecases/saveSalary";

const repo = new ChromeSettingsRepository();
const saveSalaryUseCase = new SaveSalaryUseCase(repo);

const salaryInput = document.getElementById("salary-input") as HTMLInputElement;
const hourlyWageDisplay = document.getElementById("hourly-wage")!;
const toggleEnabled = document.getElementById("toggle-enabled") as HTMLInputElement;
const saveBtn = document.getElementById("save-btn")!;
const statusMsg = document.getElementById("status-msg")!;

// 숫자 콤마 포맷팅
function formatNumber(value: string): string {
  const num = value.replace(/[^0-9]/g, "");
  if (!num) return "";
  return parseInt(num, 10).toLocaleString();
}

// 시급 계산 표시
function updateHourlyWage(): void {
  const raw = salaryInput.value.replace(/[^0-9]/g, "");
  const salary = parseInt(raw, 10);
  if (isNaN(salary) || salary <= 0) {
    hourlyWageDisplay.textContent = "-";
    return;
  }
  const hourly = Math.round(salary / 209);
  hourlyWageDisplay.textContent = `${hourly.toLocaleString()}원/시간`;
}

// 입력 이벤트: 콤마 자동 포맷 + 시급 계산
salaryInput.addEventListener("input", () => {
  const cursorPos = salaryInput.selectionStart || 0;
  const oldLen = salaryInput.value.length;
  salaryInput.value = formatNumber(salaryInput.value);
  const newLen = salaryInput.value.length;
  const newCursor = cursorPos + (newLen - oldLen);
  salaryInput.setSelectionRange(newCursor, newCursor);
  updateHourlyWage();
});

// 저장 버튼
saveBtn.addEventListener("click", async () => {
  const raw = salaryInput.value.replace(/[^0-9]/g, "");
  const salary = parseInt(raw, 10);

  if (isNaN(salary) || salary <= 0) {
    statusMsg.textContent = "올바른 월급을 입력해주세요";
    statusMsg.style.color = "#e53935";
    return;
  }

  try {
    const result = await saveSalaryUseCase.execute(salary);

    // 활성화 상태도 저장
    await repo.save({
      monthlySalary: salary,
      isEnabled: toggleEnabled.checked,
    });

    // 활성 탭의 content script에 설정 변경 알림
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "SETTINGS_CHANGED",
          monthlySalary: salary,
          isEnabled: toggleEnabled.checked,
        });
      }
    });

    statusMsg.textContent = `저장 완료 (시급: ${Math.round(result.hourlyWage).toLocaleString()}원)`;
    statusMsg.style.color = "#4CAF50";
  } catch (e) {
    statusMsg.textContent = "저장에 실패했습니다";
    statusMsg.style.color = "#e53935";
  }
});

// 페이지 로드 시 저장된 설정 불러오기
async function loadSettings(): Promise<void> {
  const settings = await repo.load();
  if (settings) {
    salaryInput.value = settings.monthlySalary.toLocaleString();
    toggleEnabled.checked = settings.isEnabled;
    updateHourlyWage();
  }
}

loadSettings();
