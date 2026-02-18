"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ImageManager from "@/components/ImageManager";

export default function AdminImagesPage() {
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
      <h1 className="text-2xl font-bold text-gray-900 mb-2">图片管理</h1>
      <p className="text-gray-500 mb-8">
        上传文章图片、Hero 背景图等。上传后可在「网站设置」中将图片 URL 填入 Hero 背景图字段。
      </p>
      <ImageManager />
    </div>
  );
}
