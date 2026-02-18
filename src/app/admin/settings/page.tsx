"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SettingsEditor from "@/components/SettingsEditor";

export default function AdminSettingsPage() {
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
      <h1 className="text-2xl font-bold text-gray-900 mb-2">网站设置</h1>
      <p className="text-gray-500 mb-8">
        修改网站各项展示内容，保存后立即生效。
      </p>
      <SettingsEditor />
    </div>
  );
}
