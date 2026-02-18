"use client";

import { useSession } from "next-auth/react";
import AdminNav from "./AdminNav";

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {session ? (
        <>
          <AdminNav />
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </>
      ) : (
        children
      )}
    </div>
  );
}
