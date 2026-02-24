"use client";

import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import { PAYMENT_CONFIG } from "@/lib/payment-config";

interface ZelleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ZelleModal({ isOpen, onClose }: ZelleModalProps) {
  const zelleEmail = PAYMENT_CONFIG.zelle.email;
  const qrImageUrl = PAYMENT_CONFIG.zelle.qrImage;

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(zelleEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          aria-label="关闭"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-zju-blue mb-2">Zelle 收款信息</h3>
        <p className="text-gray-600 text-sm mb-6">
          请使用 Zelle 将捐赠金额转账至以下账号：
        </p>
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-48 h-48 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
            <img
              src={qrImageUrl}
              alt="捐赠二维码"
              className="w-full h-full object-contain p-2"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              收款邮箱
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={zelleEmail}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-mono text-sm"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="px-4 py-3 bg-zju-blue text-white rounded-xl hover:bg-zju-blue-600 flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    复制
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <p className="mt-6 text-sm text-gray-500 text-center">
          转账完成后，请返回页面点击「提交捐赠」以完成登记。
        </p>
      </div>
    </div>
  );
}
