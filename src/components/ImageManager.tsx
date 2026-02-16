"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, Copy, Check, Loader2 } from "lucide-react";

type UploadedImage = {
  id: string;
  filename: string;
  url: string;
  alt: string | null;
  category: string | null;
  createdAt: string;
};

export default function ImageManager() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    const res = await fetch("/api/admin/images");
    const data = await res.json();
    setImages(data);
  };

  useEffect(() => {
    fetchImages().finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "article");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("上传失败");
      await fetchImages();
    } catch (err) {
      alert("上传失败：" + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除此图片？")) return;
    try {
      const res = await fetch(`/api/admin/images?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("删除失败");
      await fetchImages();
    } catch (err) {
      alert("删除失败");
    }
  };

  const copyUrl = (url: string, id: string) => {
    const fullUrl = `${typeof window !== "undefined" ? window.location.origin : ""}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-6 py-3 bg-zju-blue text-white rounded-xl font-semibold hover:bg-zju-blue-600 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          上传图片
        </button>
        <span className="text-sm text-gray-500">
          支持 JPG、PNG、GIF、WebP，建议单张不超过 5MB
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden group"
          >
            <div className="aspect-video relative bg-gray-100">
              <Image
                src={img.url}
                alt={img.alt || img.filename}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="p-3">
              <p className="text-sm text-gray-600 truncate" title={img.filename}>
                {img.filename}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => copyUrl(img.url, img.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-zju-blue hover:bg-zju-blue/10 rounded-lg"
                >
                  {copiedId === img.id ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  复制链接
                </button>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="flex items-center justify-center p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  title="删除"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl">
          暂无图片，点击「上传图片」开始上传
        </div>
      )}
    </div>
  );
}
