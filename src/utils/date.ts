import { addDays, differenceInCalendarMonths, differenceInCalendarDays, format, startOfWeek } from 'date-fns';

export const ISO_DATE = 'yyyy-MM-dd';

export function todayISO(): string {
  return format(new Date(), ISO_DATE);
}

export function formatDayHeader(dateStr: string): string {
  return format(new Date(`${dateStr}T00:00:00`), 'EEEE, MMM d');
}

export function weekStartISO(dateStr: string): string {
  return format(startOfWeek(new Date(`${dateStr}T00:00:00`), { weekStartsOn: 1 }), ISO_DATE);
}

export function formatWeekRange(weekStartDateStr: string): string {
  const start = new Date(`${weekStartDateStr}T00:00:00`);
  const end = addDays(start, 6);
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`;
}

export function formatAge(birthDateStr: string): string {
  const birth = new Date(`${birthDateStr}T00:00:00`);
  const now = new Date();
  const months = differenceInCalendarMonths(now, birth);
  if (months < 1) {
    const days = differenceInCalendarDays(now, birth);
    return `${Math.max(days, 0)} day${days === 1 ? '' : 's'} old`;
  }
  if (months < 24) {
    return `${months} month${months === 1 ? '' : 's'} old`;
  }
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return remMonths === 0 ? `${years} yr${years === 1 ? '' : 's'} old` : `${years} yr ${remMonths} mo old`;
}
