/**
 * 从 ISO 字符串提取 YYYY-MM-DD 并格式化，完全避免时区转换。
 * 编辑时选择 2月28日 → 存储 2026-02-28 → 显示 2026年2月28日
 */
function parseDatePart(dateStr: string): { y: number; m: number; d: number } | null {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
}

export function formatEventDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const p = parseDatePart(dateStr);
  if (!p) return dateStr;
  return `${p.y}年${p.m}月${p.d}日`;
}

/** 短格式：2025/3/15 */
export function formatEventDateShort(dateStr: string | null): string {
  if (!dateStr) return "";
  const p = parseDatePart(dateStr);
  if (!p) return dateStr;
  return `${p.y}/${p.m}/${p.d}`;
}
