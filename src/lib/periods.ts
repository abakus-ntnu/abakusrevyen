import { PERIODS, type Period } from "./constants";

export function getCurrentPeriod(
  override: Period | undefined = undefined,
): Period {
  if (override) {
    return override;
  }

  let now = new Date();

  for (let period of PERIODS.toReversed()) {
    if (period.from <= now) {
      return period.period;
    }
  }

  return "break";
}
