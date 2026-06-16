export const DEFAULT_POST_TIME = "10:00 AM";

function formatHourLabel(hour24: number, minute: number): string {
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const minuteLabel = minute.toString().padStart(2, "0");

  return `${hour12}:${minuteLabel} ${period}`;
}

function buildPostAvailableTimes(): string[] {
  const times: string[] = [];

  for (let hour = 10; hour <= 19; hour += 1) {
    times.push(formatHourLabel(hour, 0));

    if (hour < 19) {
      times.push(formatHourLabel(hour, 30));
    }
  }

  return times;
}

export const POST_AVAILABLE_TIMES = buildPostAvailableTimes();
