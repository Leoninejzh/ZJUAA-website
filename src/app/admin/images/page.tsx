import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ImageManager from "@/components/ImageManager";

export default async function AdminImagesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
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
