"use client";

import Image from "next/image";
import { formatEventDate } from "@/lib/date-utils";

type Article = {
  id: string;
  title: string;
  content: string;
  coverImageUrl: string | null;
  type: string;
  eventDate: string | null;
};

export default function ArticleCard({ article }: { article: Article }) {
  // 简单解析 Markdown 图片 ![alt](url)
  const renderContent = (text: string) => {
    const parts: (string | { type: "img"; src: string; alt: string })[] = [];
    let remaining = text;
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = imgRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        parts.push(remaining.slice(lastIndex, match.index));
      }
      parts.push({ type: "img", src: match[2], alt: match[1] });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < remaining.length) {
      parts.push(remaining.slice(lastIndex));
    }

    return parts.map((p, i) =>
      typeof p === "string" ? (
        p.trim() ? (
          <p key={i} className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
            {p}
          </p>
        ) : null
      ) : (
        <div key={i} className="relative w-full aspect-video my-2 rounded-lg overflow-hidden">
          <Image
            src={p.src}
            alt={p.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )
    ).filter(Boolean);
  };

  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {article.coverImageUrl && (
        <div className="relative w-full aspect-video">
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      <div className="p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 text-lg">{article.title}</h3>
        {article.eventDate && (
          <p className="text-sm text-zju-blue mt-1">
            {formatEventDate(article.eventDate)}
          </p>
        )}
        <div className="mt-3 space-y-2">{renderContent(article.content)}</div>
      </div>
    </article>
  );
}
