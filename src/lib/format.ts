export function formatRupiah(amount: number, withSpace = true): string {
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(rounded));
  const prefix = rounded < 0 ? '- ' : '';
  return `${prefix}Rp${withSpace ? ' ' : ''}${formatted}`;
}

export function formatRupiahShort(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`;
  if (abs >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}jt`;
  if (abs >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)}rb`;
  return `Rp ${amount}`;
}

export function parseRupiah(str: string): number {
  const cleaned = str.replace(/[^0-9-]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function formatDateID(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateShort(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()].slice(0, 3)}`;
}

export function relativeDateLabel(isoDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(isoDate);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Hari Ini';
  if (diff === 1) return 'Kemarin';
  if (diff === -1) return 'Besok';
  return formatDateID(isoDate);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function nowTime(): string {
  return new Date().toTimeString().slice(0, 5);
}

export function isSameDay(iso: string): boolean {
  return iso === todayISO();
}

export function isThisWeek(iso: string): boolean {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  const d = new Date(iso);
  return d >= start && d < end;
}

export function isThisMonth(iso: string): boolean {
  const now = new Date();
  const d = new Date(iso);
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function daysBetween(startISO: string, endISO: string): number {
  const s = new Date(startISO);
  const e = new Date(endISO);
  s.setHours(0, 0, 0, 0);
  e.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((e.getTime() - s.getTime()) / 86400000));
}

export function daysRemaining(endISO: string): number {
  return daysBetween(todayISO(), endISO);
}

export function dayName(iso: string): string {
  return DAYS_ID[new Date(iso).getDay()];
}
