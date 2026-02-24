"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatEventDateShort } from "@/lib/date-utils";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Loader2,
  X,
  ImageIcon,
} from "lucide-react";

type Article = {
  id: string;
  title: string;
  content: string;
  coverImageUrl: string | null;
  type: string;
  eventDate: string | null;
  sortOrder: number;
  createdAt: string;
};

export default function ArticleManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Article | null>(null);
  const [creating, setCreating] = useState(false);
  const [images, setImages] = useState<{ id: string; url: string }[]>([]);

  const fetchArticles = async () => {
    const res = await fetch("/api/admin/articles");
    const data = await res.json();
    setArticles(data);
  };

  const fetchImages = async () => {
    const res = await fetch("/api/admin/images");
    const data = await res.json();
    setImages(data.map((i: { id: string; url: string }) => ({ id: i.id, url: i.url })));
  };

  useEffect(() => {
    fetchArticles().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (editing || creating) fetchImages();
  }, [editing, creating]);

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除此文？")) return;
    try {
      await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      await fetchArticles();
    } catch {
      alert("删除失败");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-zju-blue" />
      </div>
    );
  }

  if (editing || creating) {
    return (
      <ArticleEditor
        article={editing}
        images={images}
        onSave={async () => {
          setEditing(null);
          setCreating(false);
          await fetchArticles();
        }}
        onCancel={() => {
          setEditing(null);
          setCreating(false);
        }}
      />
    );
  }

  const past = articles.filter((a) => a.type === "past");
  const upcoming = articles.filter((a) => a.type === "upcoming");

  return (
    <div className="space-y-8">
      <button
        onClick={() => setCreating(true)}
        className="flex items-center gap-2 px-4 py-2 bg-zju-blue text-white rounded-xl font-medium hover:bg-zju-blue-600"
      >
        <Plus className="w-4 h-4" />
        新建文章
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-zju-blue mb-4">过往活动</h2>
          <div className="space-y-3">
            {past.length === 0 ? (
              <p className="text-gray-500 text-sm">暂无</p>
            ) : (
              past.map((a) => (
                <ArticleCard
                  key={a.id}
                  article={a}
                  onEdit={() => setEditing(a)}
                  onDelete={() => handleDelete(a.id)}
                />
              ))
            )}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-zju-blue mb-4">活动预告</h2>
          <div className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-gray-500 text-sm">暂无</p>
            ) : (
              upcoming.map((a) => (
                <ArticleCard
                  key={a.id}
                  article={a}
                  onEdit={() => setEditing(a)}
                  onDelete={() => handleDelete(a.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleCard({
  article,
  onEdit,
  onDelete,
}: {
  article: Article;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border p-4 flex gap-4">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt=""
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon className="w-8 h-8" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{article.title}</p>
        {article.eventDate && (
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            {formatEventDateShort(article.eventDate)}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="p-2 text-zju-blue hover:bg-zju-blue/10 rounded-lg"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ArticleEditor({
  article,
  images,
  onSave,
  onCancel,
}: {
  article: Article | null;
  images: { id: string; url: string }[];
  onSave: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(article?.title ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(article?.coverImageUrl ?? "");
  const [type, setType] = useState(article?.type ?? "past");
  const [eventDate, setEventDate] = useState(
    article?.eventDate ? article.eventDate.slice(0, 10) : ""
  );
  const [sortOrder, setSortOrder] = useState(article?.sortOrder ?? 0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        title,
        content,
        coverImageUrl: coverImageUrl || null,
        type,
        eventDate: eventDate || null,
        sortOrder,
      };
      if (article) {
        await fetch(`/api/admin/articles/${article.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/admin/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      onSave();
    } catch {
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  };

  const insertImage = (url: string) => {
    setContent((prev) => prev + `\n![图片](${url})\n`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {article ? "编辑文章" : "新建文章"}
        </h2>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zju-blue"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zju-blue"
        >
          <option value="past">过往活动</option>
          <option value="upcoming">活动预告</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">活动日期</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zju-blue"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">封面图 URL</label>
        <div className="flex gap-2">
          <input
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="/uploads/xxx.jpg"
            className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zju-blue"
          />
          <div className="flex gap-1 flex-wrap">
            {images.slice(0, 5).map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setCoverImageUrl(img.url)}
                className="w-10 h-10 rounded border overflow-hidden flex-shrink-0"
              >
                <Image src={img.url} alt="" width={40} height={40} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">正文</label>
        <div className="mb-2 flex gap-1 flex-wrap">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => insertImage(img.url)}
              className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              插入图片
            </button>
          ))}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          placeholder="支持 Markdown，可点击上方按钮插入图片"
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zju-blue resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">排序（数字越大越靠前）</label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
          className="w-32 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-zju-blue"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-zju-blue text-white rounded-xl font-medium hover:bg-zju-blue-600 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border rounded-xl font-medium"
        >
          取消
        </button>
      </div>
    </form>
  );
}
