"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ArticleManager from "@/components/ArticleManager";

export default function AdminArticlesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin/login");
  }, [status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">活动文章</h1>
      <p className="text-gray-500 mb-8">
        管理过往活动和活动预告，支持上传封面图和正文图片。
      </p>
      <ArticleManager />
    </div>
  );
}
