import { PERIODS, type Period } from "./constants";
import { SHOWS } from "./shows";

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

export function nextShow() {
  let now = new Date();

  for (let show of SHOWS) {
    if (now < show.when) {
      return show;
    }
  }

  return undefined;
}
