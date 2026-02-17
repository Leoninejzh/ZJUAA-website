"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <h1 className="text-xl font-bold text-red-600 mb-2">出错了</h1>
        <p className="text-gray-600 mb-6">
          页面加载时发生错误。请检查环境变量配置（DATABASE_URL、NEXTAUTH_SECRET 等）。若 Prisma 报 EPERM，可在 .env 中设置 SKIP_DATABASE=1 临时跳过数据库。
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-zju-blue text-white rounded-xl font-medium hover:bg-zju-blue-600"
        >
          重试
        </button>
      </div>
    </div>
  );
}
