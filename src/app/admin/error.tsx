"use client";

import { useEffect, useState } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [health, setHealth] = useState<{ ok?: boolean; checks?: Record<string, boolean>; hint?: string } | null>(null);

  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth({ ok: false }));
  }, []);

  const isWebpackCallError =
    error?.message?.includes("reading 'call'") ?? false;
  const isNextAuthError =
    error?.message?.includes("NEXTAUTH") ||
    error?.message?.includes("secret") ||
    error?.message?.includes("callback");

  const missingVars = health?.checks
    ? Object.entries(health.checks)
        .filter(([, v]) => !v)
        .map(([k]) => k)
    : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <h1 className="text-xl font-bold text-red-600 mb-2">出错了</h1>
        <p className="text-gray-600 mb-6">
          {isWebpackCallError ? (
            <>
              页面加载异常，通常由缓存或模块加载问题引起。请点击「刷新页面」重新加载。
            </>
          ) : isNextAuthError || missingVars.length > 0 ? (
            <>
              认证配置异常。请在部署平台设置：<code className="bg-gray-100 px-1 rounded">NEXTAUTH_SECRET</code>、<code className="bg-gray-100 px-1 rounded">NEXTAUTH_URL</code>（需为完整网址）。
              {missingVars.length > 0 && (
                <span className="block mt-2 text-sm text-amber-600">
                  当前缺失：{missingVars.join(", ")}
                </span>
              )}
            </>
          ) : (
            <>
              管理后台加载时发生错误。请检查环境变量配置，或尝试刷新页面。
            </>
          )}
        </p>
        {(process.env.NODE_ENV === "development" || !health?.ok) && error?.message && (
          <pre className="text-left text-xs text-red-500 bg-red-50 p-3 rounded mb-4 overflow-auto max-h-24">
            {error.message}
          </pre>
        )}
        {health?.hint && (
          <p className="text-sm text-gray-500 mb-4">{health.hint}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-zju-blue text-white rounded-xl font-medium hover:bg-zju-blue-600"
          >
            刷新页面
          </button>
          <button
            onClick={reset}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
          >
            重试
          </button>
        </div>
      </div>
    </div>
  );
}
