import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ArticleManager from "@/components/ArticleManager";

export default async function AdminArticlesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
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
