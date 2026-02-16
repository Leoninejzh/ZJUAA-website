import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SettingsEditor from "@/components/SettingsEditor";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
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
