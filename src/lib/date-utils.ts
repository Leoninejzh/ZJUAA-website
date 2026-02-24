/**
 * 将 API 返回的日期字符串格式化为本地日期显示，避免时区导致日期偏移。
 * 例如：编辑时选择 2025-03-15，网页显示也应为 2025年3月15日。
 */
export function formatEventDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const match = dateStr.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateStr;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** 短格式：2025/3/15 */
export function formatEventDateShort(dateStr: string | null): string {
  if (!dateStr) return "";
  const match = dateStr.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateStr;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.toLocaleDateString("zh-CN");
}
