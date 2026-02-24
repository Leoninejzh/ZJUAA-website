"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Shield, Users, Building2 } from "lucide-react";
import DonationForm from "./DonationForm";
import ZelleModal from "./ZelleModal";
import SuccessModal from "./SuccessModal";
import SiteNav from "./SiteNav";
import { useSettings } from "./SettingsProvider";

export default function DonationPage() {
  const { settings } = useSettings();
  const [showZelleModal, setShowZelleModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <SiteNav />
        {/* Hero Section */}
        <section className="relative h-[280px] sm:h-[360px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={settings.heroImageUrl}
              alt="浙江大学校园"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-zju-blue/75" />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              {settings.heroTitle}
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-white/95 max-w-2xl">
              {settings.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Main Content - Two Column Layout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Column - Story & Transparency */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
                <h2 className="text-xl font-bold text-zju-blue mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  {settings.donationStoryTitle}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {settings.donationStoryP1}
                </p>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {settings.donationStoryP2}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
                <h2 className="text-xl font-bold text-zju-blue mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {settings.transparencyTitle}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {settings.transparencyIntro}
                </p>
                <ul className="space-y-3 text-gray-600">
                  {settings.transparencyItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {i === 0 ? (
                        <Users className="w-4 h-4 mt-0.5 text-zju-blue flex-shrink-0" />
                      ) : i === 1 ? (
                        <Building2 className="w-4 h-4 mt-0.5 text-zju-blue flex-shrink-0" />
                      ) : (
                        <Heart className="w-4 h-4 mt-0.5 text-zju-blue flex-shrink-0" />
                      )}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column - Donation Card */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-zju-blue/20 p-6 sm:p-8 lg:p-10 relative z-10">
                <DonationForm
                  onZelleClick={() => setShowZelleModal(true)}
                  onSuccess={() => setShowSuccessModal(true)}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <ZelleModal
        isOpen={showZelleModal}
        onClose={() => setShowZelleModal(false)}
      />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}
