"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import type { SiteSettings } from "./SettingsProvider";

const FIELDS: {
  key: keyof SiteSettings;
  label: string;
  type: "text" | "textarea" | "array";
  placeholder?: string;
}[] = [
  { key: "heroTitle", label: "Hero 主标题", type: "text", placeholder: "支持浙大大纽约校友会" },
  { key: "heroSubtitle", label: "Hero 副标题", type: "text", placeholder: "您的慷慨捐赠将帮助我们实现使命..." },
  { key: "heroImageUrl", label: "Hero 背景图 URL", type: "text", placeholder: "图片链接或 /uploads/xxx.jpg" },
  { key: "donationStoryTitle", label: "捐赠故事标题", type: "text" },
  { key: "donationStoryP1", label: "捐赠故事 第一段", type: "textarea" },
  { key: "donationStoryP2", label: "捐赠故事 第二段", type: "textarea" },
  { key: "transparencyTitle", label: "资金透明度标题", type: "text" },
  { key: "transparencyIntro", label: "资金透明度引言", type: "text" },
  { key: "transparencyItems", label: "资金用途列表（每行一项）", type: "array" },
  { key: "zelleEmail", label: "Zelle 收款邮箱", type: "text" },
  { key: "zelleQrImageUrl", label: "Zelle 二维码图片 URL（留空则自动生成）", type: "text", placeholder: "/uploads/或完整图片链接" },
  { key: "zeffyDonationUrl", label: "Zeffy 捐赠页面链接", type: "text", placeholder: "https://www.zeffy.com/..." },
  { key: "zeffyQrImageUrl", label: "Zeffy 二维码图片 URL（留空则根据链接自动生成）", type: "text", placeholder: "/uploads/或完整图片链接" },
  { key: "navBrand", label: "导航栏品牌名", type: "text" },
  { key: "siteTitle", label: "网站标题 (SEO)", type: "text" },
  { key: "siteDescription", label: "网站描述 (SEO)", type: "textarea" },
];

export default function SettingsEditor() {
  const router = useRouter();
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => setMessage({ type: "error", text: "加载失败" }))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: keyof SiteSettings, value: string | string[]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = FIELDS.reduce(
        (acc, { key, type }) => {
          const val = settings[key];
          acc[key] = val === undefined ? (type === "array" ? [] : "") : val;
          return acc;
        },
        {} as Record<string, string | string[]>
      );
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (data as { error?: string }).error || `保存失败 (${res.status})`;
        throw new Error(msg);
      }
      setMessage({ type: "success", text: "保存成功！" });
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "保存失败，请重试",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-zju-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl ${
            message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {FIELDS.map(({ key, label, type, placeholder }) => (
          <div key={key} className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
            {type === "text" && (
              <input
                type="text"
                value={(settings[key] as string) ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zju-blue focus:border-transparent"
              />
            )}
            {type === "textarea" && (
              <textarea
                value={(settings[key] as string) ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zju-blue focus:border-transparent resize-none"
              />
            )}
            {type === "array" && (
              <textarea
                value={Array.isArray(settings[key]) ? (settings[key] as string[]).join("\n") : ""}
                onChange={(e) =>
                  handleChange(
                    key,
                    e.target.value.split("\n").filter(Boolean)
                  )
                }
                placeholder="每行一项"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zju-blue focus:border-transparent resize-none"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-zju-blue text-white rounded-xl font-semibold hover:bg-zju-blue-600 disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        保存设置
      </button>
    </div>
  );
}
