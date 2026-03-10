"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, ChevronLeft, DollarSign, User, CreditCard, ExternalLink } from "lucide-react";
import { donationSchema, type DonationFormData } from "@/lib/donation-schema";
import { PAYMENT_CONFIG } from "@/lib/payment-config";

interface DonationFormProps {
  onZelleClick: () => void;
  onSuccess: () => void;
}

export default function DonationForm({ onZelleClick, onSuccess }: DonationFormProps) {
  const zeffyUrl = PAYMENT_CONFIG.zeffy.url;
  const zeffyQrSrc = PAYMENT_CONFIG.zeffy.qrImage;
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 0,
      name: "",
      email: "",
      graduationYear: "",
      major: "",
      message: "",
      paymentMethod: "zelle",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const nextStep = async () => {
    if (step === 1) {
      setValue("amount", 1);
    }
    if (step === 2) {
      const valid = await trigger(["name", "email"]);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: DonationFormData) => {
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        onSuccess();
      } else {
        throw new Error("提交失败");
      }
    } catch (err) {
      console.error(err);
      alert("提交失败，请稍后重试");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      {/* Step Indicator */}
      <div className="flex items-center justify-between text-sm">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex items-center ${s < 3 ? "flex-1" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                step >= s ? "bg-zju-blue text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {s}
            </div>
            {s < 3 && <div className="flex-1 h-0.5 bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      {/* Step 1: Welcome - click 现在捐赠 to go to step 2 */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zju-blue flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            欢迎捐赠
          </h3>
          <p className="text-gray-600">感谢您对浙大校友会的支持！</p>
        </div>
      )}

      {/* Step 2: Info */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zju-blue flex items-center gap-2">
            <User className="w-5 h-5" />
            捐赠人信息
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名 *
            </label>
            <input
              {...register("name")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zju-blue focus:border-transparent"
              placeholder="您的姓名"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱 *
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zju-blue focus:border-transparent"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              入学年份（选填）
            </label>
            <input
              {...register("graduationYear")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zju-blue focus:border-transparent"
              placeholder="例如：2015"
              maxLength={4}
            />
            {errors.graduationYear && (
              <p className="mt-1 text-sm text-red-600">
                {errors.graduationYear.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              专业（选填）
            </label>
            <input
              {...register("major")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zju-blue focus:border-transparent"
              placeholder="例如：计算机科学"
            />
            {errors.major && (
              <p className="mt-1 text-sm text-red-600">{errors.major.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              留言（选填）
            </label>
            <textarea
              {...register("message")}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-zju-blue focus:border-transparent resize-none"
              placeholder="想对我们说的话..."
            />
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zju-blue flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            支付方式
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 has-[input:checked]:border-zju-blue has-[input:checked]:bg-zju-blue/5">
              <input
                type="radio"
                value="zelle"
                {...register("paymentMethod")}
                className="w-4 h-4 text-zju-blue"
              />
              <span className="font-medium">Zelle</span>
              <span className="text-sm text-gray-500">点击后显示收款账号和二维码</span>
            </label>
            <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 has-[input:checked]:border-zju-blue has-[input:checked]:bg-zju-blue/5">
              <input
                type="radio"
                value="zeffy"
                {...register("paymentMethod")}
                className="w-4 h-4 text-zju-blue"
              />
              <span className="font-medium">Zeffy 在线捐赠</span>
            </label>
            <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 has-[input:checked]:border-zju-blue has-[input:checked]:bg-zju-blue/5">
              <input
                type="radio"
                value="card"
                {...register("paymentMethod")}
                className="w-4 h-4 text-zju-blue"
              />
              <span className="font-medium">Credit Card / PayPal</span>
              <span className="text-sm text-gray-500">预留 Stripe / PayPal 接口</span>
            </label>
          </div>
          {paymentMethod === "zelle" && (
            <button
              type="button"
              onClick={onZelleClick}
              className="w-full py-3 bg-zju-blue text-white rounded-xl font-semibold hover:bg-zju-blue-600 transition-colors"
            >
              查看 Zelle 收款信息
            </button>
          )}
          {paymentMethod === "zeffy" && (
            <div className="space-y-4 pt-2">
              <div className="flex flex-col items-center gap-4">
                {zeffyQrSrc && (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-gray-500">或扫描下方二维码</span>
                    <div className="relative w-48 h-48 bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={zeffyQrSrc}
                        alt="Zeffy 捐赠二维码"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(zeffyUrl, "_blank", "noopener,noreferrer");
                  }}
                  className="w-full py-3 px-4 bg-zju-blue text-white rounded-xl font-semibold hover:bg-zju-blue-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-5 h-5" />
                  前往 Zeffy 捐赠
                </button>
              </div>
            </div>
          )}
          {paymentMethod === "card" && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
              信用卡/PayPal 支付功能即将上线，敬请期待。您可先选择 Zelle 完成捐赠。
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              prevStep();
            }}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            上一步
          </button>
        ) : (
          <div className="flex-1" />
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              nextStep();
            }}
            className="flex-1 py-3 px-4 bg-zju-blue text-white rounded-xl font-semibold hover:bg-zju-blue-600 flex items-center justify-center gap-2"
          >
            {step === 1 ? "现在捐赠" : "下一步"}
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : paymentMethod === "zeffy" ? (
          <div className="flex-1" />
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 bg-zju-blue text-white rounded-xl font-semibold hover:bg-zju-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? "提交中..." : "提交捐赠"}
          </button>
        )}
      </div>
    </form>
  );
}
