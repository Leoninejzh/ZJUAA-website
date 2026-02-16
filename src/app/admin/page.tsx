import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Settings, Image, ExternalLink, FileText } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">欢迎回来</h1>
      <p className="text-gray-500 mb-8">
        您已登录管理后台，可以在此修改网站内容和上传图片。
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        <Link
          href="/admin/settings"
          className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-zju-blue/50 hover:shadow-lg transition-all group"
        >
          <Settings className="w-10 h-10 text-zju-blue mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-zju-blue">
            网站设置
          </h2>
          <p className="text-gray-500 text-sm">
            修改 Hero 标题、捐赠故事、Zelle 邮箱等网站要素
          </p>
        </Link>

        <Link
          href="/admin/articles"
          className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-zju-blue/50 hover:shadow-lg transition-all group"
        >
          <FileText className="w-10 h-10 text-zju-blue mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-zju-blue">
            活动文章
          </h2>
          <p className="text-gray-500 text-sm">
            管理过往活动和活动预告，上传文章和图片
          </p>
        </Link>

        <Link
          href="/admin/images"
          className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-zju-blue/50 hover:shadow-lg transition-all group"
        >
          <Image className="w-10 h-10 text-zju-blue mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-zju-blue">
            图片管理
          </h2>
          <p className="text-gray-500 text-sm">
            上传文章图片、Hero 背景图等，管理已上传的图片
          </p>
        </Link>
      </div>

      <div className="mt-8 p-4 bg-zju-blue/5 rounded-xl border border-zju-blue/20">
        <a
          href="/donation"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-zju-blue font-medium hover:underline"
        >
          <ExternalLink className="w-4 h-4" />
          在新窗口预览捐赠页面
        </a>
      </div>
    </div>
  );
}
