import { describe, it, expect } from "vitest";
import { WorkTime } from "./workTime";

describe("WorkTime", () => {
  describe("fromMinutes", () => {
    it("0분을 생성한다", () => {
      const wt = WorkTime.fromMinutes(0);
      expect(wt.format()).toBe("0분");
    });

    it("분 단위만 표시한다 (30분)", () => {
      const wt = WorkTime.fromMinutes(30);
      expect(wt.format()).toBe("30분");
    });

    it("59분을 표시한다", () => {
      const wt = WorkTime.fromMinutes(59);
      expect(wt.format()).toBe("59분");
    });

    it("정확히 1시간을 표시한다 (60분)", () => {
      const wt = WorkTime.fromMinutes(60);
      expect(wt.format()).toBe("1시간");
    });

    it("시간과 분을 함께 표시한다 (330분 -> 5시간 30분)", () => {
      const wt = WorkTime.fromMinutes(330);
      expect(wt.format()).toBe("5시간 30분");
    });

    it("정확히 1일을 표시한다 (1440분 = 24시간 = 법정근로 3일)", () => {
      // 1일 = 8시간 근무 기준 = 480분
      const wt = WorkTime.fromMinutes(480);
      expect(wt.format()).toBe("1일");
    });

    it("일과 시간을 함께 표시한다 (1560분 -> 약 3일 4시간 근무)", () => {
      // 1560분 = 26시간 = 3일(24시간) + 2시간
      // 근무 기준: 1560 / 60 = 26시간, 26 / 8 = 3일 나머지 2시간
      const wt = WorkTime.fromMinutes(1560);
      expect(wt.format()).toBe("3일 2시간");
    });

    it("정확히 1개월을 표시한다 (209시간 = 12540분)", () => {
      // 월 209시간 = 209 * 60 = 12540분
      const wt = WorkTime.fromMinutes(12540);
      expect(wt.format()).toBe("1개월");
    });

    it("1개월 이상을 표시한다", () => {
      // 2개월 + 5일 + 3시간 = 2 * 12540 + 5 * 480 + 180 = 25080 + 2400 + 180 = 27660분
      const wt = WorkTime.fromMinutes(27660);
      expect(wt.format()).toBe("2개월 5일 3시간");
    });

    it("음수 입력 시 에러를 던진다", () => {
      expect(() => WorkTime.fromMinutes(-1)).toThrow();
    });

    it("totalMinutes를 반환한다", () => {
      const wt = WorkTime.fromMinutes(150);
      expect(wt.totalMinutes).toBe(150);
    });
  });
});
