"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Settings, Image, LayoutDashboard, LogOut, FileText, Heart } from "lucide-react";

const navItems = [
  { href: "/admin", label: "概览", icon: LayoutDashboard },
  { href: "/admin/donations", label: "捐赠记录", icon: Heart },
  { href: "/admin/articles", label: "活动文章", icon: FileText },
  { href: "/admin/settings", label: "网站设置", icon: Settings },
  { href: "/admin/images", label: "图片管理", icon: Image },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="font-bold text-zju-blue text-lg"
            >
              管理后台
            </Link>
            <div className="flex gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === href
                      ? "bg-zju-blue/10 text-zju-blue"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/donation"
              target="_blank"
              className="text-sm text-gray-500 hover:text-zju-blue"
            >
              预览网站
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              退出
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
