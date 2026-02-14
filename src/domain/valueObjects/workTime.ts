// 근무 시간 값 객체
// 월 법정 근로시간 209시간, 1일 8시간 기준

const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 8; // 법정 근로 1일 = 8시간
const HOURS_PER_MONTH = 209; // 한국 법정 월 근로시간
const MINUTES_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR; // 480분
const MINUTES_PER_MONTH = HOURS_PER_MONTH * MINUTES_PER_HOUR; // 12540분

export class WorkTime {
  private constructor(public readonly totalMinutes: number) {}

  static fromMinutes(minutes: number): WorkTime {
    if (minutes < 0) {
      throw new Error("근무 시간은 음수가 될 수 없습니다");
    }
    return new WorkTime(minutes);
  }

  format(): string {
    if (this.totalMinutes === 0) return "0분";

    let remaining = this.totalMinutes;

    const months = Math.floor(remaining / MINUTES_PER_MONTH);
    remaining %= MINUTES_PER_MONTH;

    const days = Math.floor(remaining / MINUTES_PER_DAY);
    remaining %= MINUTES_PER_DAY;

    const hours = Math.floor(remaining / MINUTES_PER_HOUR);
    remaining %= MINUTES_PER_HOUR;

    const minutes = Math.round(remaining);

    const parts: string[] = [];
    if (months > 0) parts.push(`${months}개월`);
    if (days > 0) parts.push(`${days}일`);
    if (hours > 0) parts.push(`${hours}시간`);
    if (minutes > 0) parts.push(`${minutes}분`);

    return parts.join(" ");
  }
}
