// 가격을 근무 시간으로 변환하는 도메인 서비스

import { Salary } from "../entities/salary";
import { WorkTime } from "../valueObjects/workTime";

const MINUTES_PER_HOUR = 60;

export function convertPriceToWorkTime(price: number, salary: Salary): WorkTime {
  if (price < 0) {
    throw new Error("가격은 음수가 될 수 없습니다");
  }
  if (price === 0) {
    return WorkTime.fromMinutes(0);
  }
  const hours = price / salary.hourlyWage;
  const minutes = Math.round(hours * MINUTES_PER_HOUR);
  return WorkTime.fromMinutes(minutes);
}
