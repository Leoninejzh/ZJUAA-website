"use client";

import { useEffect, useState } from "react";
import { DollarSign, User, Mail, Calendar, BookOpen, MessageSquare, Trash2 } from "lucide-react";

type Donation = {
  id: string;
  amount: number;
  name: string;
  email: string;
  graduationYear: string;
  major: string;
  message: string | null;
  paymentMethod: string;
  createdAt: string;
};

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/donations")
      .then((res) => {
        if (!res.ok) throw new Error("获取失败");
        return res.json();
      })
      .then(setDonations)
      .catch(() => setError("加载捐赠列表失败"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条捐赠记录吗？此操作不可恢复。")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/donations?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || `删除失败 (${res.status})`);
      }
      setDonations((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除失败，请重试");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>
    );
  }

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">捐赠记录</h1>
      <p className="text-gray-500 mb-6">
        查看所有捐赠人提交的信息
      </p>

      <div className="mb-6 p-4 bg-zju-blue/5 rounded-xl border border-zju-blue/20">
        <div className="flex items-center gap-2 text-zju-blue font-semibold">
          <DollarSign className="w-5 h-5" />
          共 {donations.length} 笔捐赠，合计 ${totalAmount.toLocaleString()}
        </div>
      </div>

      {donations.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
          暂无捐赠记录
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-zju-blue/30 transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-zju-blue">
                    ${d.amount.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(d.createdAt).toLocaleString("zh-CN")}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100">
                    {d.paymentMethod === "zelle" ? "Zelle" : d.paymentMethod === "zeffy" ? "Zeffy" : "信用卡"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(d.id)}
                  disabled={deletingId === d.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4 text-zju-blue flex-shrink-0" />
                  <span>{d.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-zju-blue flex-shrink-0" />
                  <a href={`mailto:${d.email}`} className="text-zju-blue hover:underline">
                    {d.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-zju-blue flex-shrink-0" />
                  <span>{d.graduationYear} 级</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <BookOpen className="w-4 h-4 text-zju-blue flex-shrink-0" />
                  <span>{d.major}</span>
                </div>
              </div>
              {d.message && (
                <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                  <MessageSquare className="w-4 h-4 text-zju-blue flex-shrink-0 mt-0.5" />
                  <span>{d.message}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
