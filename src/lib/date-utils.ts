/**
 * 将 API 返回的日期字符串格式化为显示，使用 UTC 日期避免时区偏移。
 * 编辑时选择 2月28日，存储为 2026-02-28，显示也应为 2026年2月28日。
 */
export function formatEventDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  return new Date(y, m, d).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** 短格式：2025/3/15 */
export function formatEventDateShort(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  return new Date(y, m, d).toLocaleDateString("zh-CN");
}
