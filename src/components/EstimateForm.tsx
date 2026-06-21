"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Upload, X, CheckCircle, AlertCircle, Calendar, Plus, Car } from "lucide-react";

interface PhotoData {
  name: string;
  base64: string;
  size: number;
}

export const EstimateForm: React.FC = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    car: "",
    serviceType: "bodywork",
    message: "",
    date: "",
    captchaAnswer: "",
  });

  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, sum: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "captcha-error">("idle");

  // Generate new math captcha on load or reset
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1, num2, sum: num1 + num2 });
    setFormData((prev) => ({ ...prev, captchaAnswer: "" }));
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Convert uploaded files to base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    
    // Limit to max 4 photos total
    const slotsAvailable = 4 - photos.length;
    const filesToProcess = filesArray.slice(0, slotsAvailable);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotos((prev) => [
            ...prev,
            {
              name: file.name,
              base64: reader.result as string,
              size: file.size,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("idle");

    // Verify Captcha
    if (parseInt(formData.captchaAnswer, 10) !== captcha.sum) {
      setSubmitStatus("captcha-error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          photos, // contains base64 strings with filenames
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Clear form
        setFormData({
          name: "",
          email: "",
          phone: "",
          car: "",
          serviceType: "bodywork",
          message: "",
          date: "",
          captchaAnswer: "",
        });
        setPhotos([]);
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      generateCaptcha(); // Refresh captcha
    }
  };

  return (
    <div className="w-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 transition-colors duration-300">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
          {t.estimate.title}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {t.estimate.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Client Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              {t.estimate.fieldName} *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-orange-300 bg-orange-50/30 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-orange-500 dark:focus:bg-zinc-950/40 transition-all duration-200"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              {t.estimate.fieldEmail} *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-orange-300 bg-orange-50/30 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-orange-500 dark:focus:bg-zinc-950/40 transition-all duration-200"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              {t.estimate.fieldPhone} *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-orange-300 bg-orange-50/30 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-orange-500 dark:focus:bg-zinc-950/40 transition-all duration-200"
            />
          </div>

          {/* Car Info */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              {t.estimate.fieldCar} *
            </label>
            <input
              type="text"
              name="car"
              required
              placeholder="e.g., VW Golf 2018, ZH 12345"
              value={formData.car}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-orange-300 bg-orange-50/30 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-orange-500 dark:focus:bg-zinc-950/40 transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Service Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              {t.estimate.fieldServiceType} *
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-orange-300 bg-orange-50/30 px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-orange-500 dark:focus:bg-zinc-950/40 transition-all duration-200"
            >
              <option value="bodywork">{t.services.bodyworkTitle}</option>
              <option value="painting">{t.services.paintingTitle}</option>
              <option value="repair">{t.services.repairTitle}</option>
              <option value="tires">{t.services.tiresTitle}</option>
              <option value="mfk">{t.services.mfkTitle}</option>
              <option value="autokauf">{t.services.autokaufTitle}</option>
            </select>
          </div>

          {/* Appointment Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              {t.estimate.fieldDate}
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-orange-300 bg-orange-50/30 pl-4 pr-10 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-orange-500 dark:focus:bg-zinc-950/40 transition-all duration-200"
              />
              <Calendar className="absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            {t.estimate.fieldMessage} *
          </label>
          <textarea
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-orange-300 bg-orange-50/30 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-orange-500 dark:focus:bg-zinc-950/40 transition-all duration-200 resize-none"
          />
        </div>

        {/* Photo Upload Area */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            {t.estimate.fieldPhotos} ({photos.length}/4)
          </label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="group relative h-24 w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-sm"
              >
                <img
                  src={photo.base64}
                  alt={photo.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white opacity-80 hover:opacity-100 hover:scale-105 transition-all shadow-md"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {photos.length < 4 && (
              <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/30 hover:bg-orange-50/30 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-900/50 dark:hover:border-orange-500 transition-all shadow-sm">
                <Upload size={20} className="text-zinc-400 dark:text-zinc-500 mb-1" />
                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  {t.estimate.btnSelectPhoto}
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Captcha & Submit Area */}
        <div className="flex flex-col gap-4 border-t border-zinc-100 pt-5 dark:border-zinc-900 sm:flex-row sm:items-center sm:justify-between">
          {/* Captcha */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              {t.estimate.captchaTitle}:
            </span>
            <span className="rounded-lg bg-zinc-100 px-3 py-1.5 text-base font-black tracking-widest text-orange-600 dark:bg-zinc-900 dark:text-orange-400">
              {captcha.num1} + {captcha.num2} =
            </span>
            <input
              type="number"
              name="captchaAnswer"
              required
              placeholder={t.estimate.captchaPlaceholder}
              value={formData.captchaAnswer}
              onChange={handleInputChange}
              className="w-20 rounded-lg border border-orange-300 bg-orange-50/30 px-2 py-1.5 text-center text-sm font-bold outline-none focus:border-orange-500 dark:border-zinc-800 dark:bg-zinc-900 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 text-base font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-red-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all duration-200 w-full sm:w-auto"
          >
            {isSubmitting ? t.estimate.sending : t.estimate.btnSubmit}
          </button>
        </div>

        {/* Feedback Notifications */}
        {submitStatus === "success" && (
          <div className="flex items-start gap-3 rounded-xl bg-green-500/10 border border-green-500/25 p-4 text-green-700 dark:text-green-400">
            <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm font-bold">{t.estimate.success}</p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/25 p-4 text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm font-bold">{t.estimate.error}</p>
          </div>
        )}

        {submitStatus === "captcha-error" && (
          <div className="flex items-start gap-3 rounded-xl bg-yellow-500/10 border border-yellow-500/25 p-4 text-yellow-700 dark:text-yellow-400">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm font-bold">{t.estimate.captchaError}</p>
          </div>
        )}
      </form>
    </div>
  );
};
