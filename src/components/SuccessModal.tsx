"use client";

import { Heart, CheckCircle } from "lucide-react";
import Link from "next/link";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 sm:p-10 text-center animate-fade-in">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-zju-blue mb-2">
          感谢您的慷慨捐赠！
        </h2>
        <p className="text-gray-600 mb-6">
          您的支持将帮助我们更好地服务浙大大纽约地区校友社区，传承求是精神。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-zju-blue text-white rounded-xl font-semibold hover:bg-zju-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" />
            继续浏览
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
