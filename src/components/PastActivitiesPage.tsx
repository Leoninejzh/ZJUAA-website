"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import SiteNav from "./SiteNav";
import ArticleCard from "./ArticleCard";

type Article = {
  id: string;
  title: string;
  content: string;
  coverImageUrl: string | null;
  type: string;
  eventDate: string | null;
};

export default function PastActivitiesPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch("/api/articles?type=past")
      .then((r) => r.json())
      .then(setArticles)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNav />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="text-3xl font-bold text-zju-blue mb-2 flex items-center gap-2">
          <Calendar className="w-8 h-8" />
          过往活动
        </h1>
        <p className="text-gray-500 mb-12">回顾校友会精彩活动</p>

        <div className="space-y-6">
          {articles.length === 0 ? (
            <p className="text-gray-500 bg-white rounded-2xl border p-8 text-center">
              暂无过往活动
            </p>
          ) : (
            articles.map((a) => <ArticleCard key={a.id} article={a} />)
          )}
        </div>
      </section>
    </div>
  );
}
