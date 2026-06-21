"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { ArrowLeft, Lock, LogOut, CheckCircle, AlertCircle, Upload, Eye, FileImage, X, Trash2, Globe } from "lucide-react";
import Link from "next/link";

interface Job {
  id: number | string;
  titleDe: string;
  titleTr: string;
  titleEn: string;
  beforeImage: string;
  afterImage: string;
  createdAt: string;
  carModel?: string;
}

interface Car {
  id: string;
  title: string;
  price: number;
  mileage: number;
  year: string;
  power: string;
  transmission: string;
  fuelType: string;
  mfk: string;
  descriptionDe: string;
  descriptionTr: string;
  descriptionEn: string;
  imageUrls: string[];
  createdAt: string;
}

export default function AdminPage() {
  const { t } = useLanguage();
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"jobs" | "cars">("jobs");

  // --- TAB 1: REPAIR JOBS FORM STATES ---
  const [carModel, setCarModel] = useState("");
  const [titleDe, setTitleDe] = useState("");
  const [titleTr, setTitleTr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [beforeImg, setBeforeImg] = useState<string | null>(null);
  const [afterImg, setAfterImg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [existingJobs, setExistingJobs] = useState<Job[]>([]);
  const [isTranslating, setIsTranslating] = useState<string | null>(null);

  // --- TAB 2: CAR SALES FORM STATES ---
  const [carTitle, setCarTitle] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [carMileage, setCarMileage] = useState("");
  const [carYear, setCarYear] = useState("");
  const [carPower, setCarPower] = useState("");
  const [carTransmission, setCarTransmission] = useState("Automat");
  const [carFuelType, setCarFuelType] = useState("Benzin");
  const [carMfk, setCarMfk] = useState("");
  const [carDescDe, setCarDescDe] = useState("");
  const [carDescTr, setCarDescTr] = useState("");
  const [carDescEn, setCarDescEn] = useState("");
  const [carImages, setCarImages] = useState<string[]>([]);
  const [isSubmittingCar, setIsSubmittingCar] = useState(false);
  const [carStatus, setCarStatus] = useState<"idle" | "success" | "error">("idle");
  const [carErrorMsg, setCarErrorMsg] = useState("");
  const [existingCars, setExistingCars] = useState<Car[]>([]);
  const [isTranslatingCar, setIsTranslatingCar] = useState<string | null>(null);

  // Check login on load
  useEffect(() => {
    const savedAuth = localStorage.getItem("sazcar_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
      fetchJobs();
      fetchCars();
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setExistingJobs(data);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchCars = async () => {
    try {
      const res = await fetch("/api/cars");
      if (res.ok) {
        const data = await res.json();
        setExistingCars(data);
      }
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "sazcar2026") {
      setIsAuthenticated(true);
      localStorage.setItem("sazcar_admin_auth", "true");
      setAuthError(false);
      fetchJobs();
      fetchCars();
    } else {
      setAuthError(true);
      setPasscode("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("sazcar_admin_auth");
  };

  // --- JOB FILE CHANGE ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "before" | "after") => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        if (type === "before") {
          setBeforeImg(reader.result);
        } else {
          setAfterImg(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // --- JOB AUTO-TRANSLATE ---
  const handleTranslate = async (sourceLang: "tr" | "de" | "en") => {
    let text = "";
    if (sourceLang === "tr") text = titleTr;
    else if (sourceLang === "de") text = titleDe;
    else if (sourceLang === "en") text = titleEn;

    if (!text) return;
    setIsTranslating(sourceLang);

    try {
      const targets = [
        { lang: "tr", setter: setTitleTr },
        { lang: "de", setter: setTitleDe },
        { lang: "en", setter: setTitleEn }
      ].filter(t => t.lang !== sourceLang);

      for (const target of targets) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${target.lang}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data[0] && data[0][0] && data[0][0][0]) {
            target.setter(data[0][0][0]);
          }
        }
      }
    } catch (err) {
      console.error(`Translation from ${sourceLang} failed:`, err);
    } finally {
      setIsTranslating(null);
    }
  };

  // --- CAR AUTO-TRANSLATE ---
  const handleCarTranslate = async (sourceLang: "tr" | "de" | "en") => {
    let text = "";
    if (sourceLang === "tr") text = carDescTr;
    else if (sourceLang === "de") text = carDescDe;
    else if (sourceLang === "en") text = carDescEn;

    if (!text) return;
    setIsTranslatingCar(sourceLang);

    try {
      const targets = [
        { lang: "tr", setter: setCarDescTr },
        { lang: "de", setter: setCarDescDe },
        { lang: "en", setter: setCarDescEn }
      ].filter(t => t.lang !== sourceLang);

      for (const target of targets) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${target.lang}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data[0] && data[0][0] && data[0][0][0]) {
            target.setter(data[0][0][0]);
          }
        }
      }
    } catch (err) {
      console.error(`Translation from ${sourceLang} failed:`, err);
    } finally {
      setIsTranslatingCar(null);
    }
  };

  // --- JOB SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforeImg || !afterImg) {
      setStatus("error");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: "sazcar2026",
          titleDe,
          titleTr,
          titleEn,
          beforeImage: beforeImg,
          afterImage: afterImg,
          carModel,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setCarModel("");
        setTitleDe("");
        setTitleTr("");
        setTitleEn("");
        setBeforeImg(null);
        setAfterImg(null);
        fetchJobs(); // reload list
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- CAR MULTI FILE CHANGE ---
  const handleCarFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setCarImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // --- CAR SUBMIT ---
  const handleCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (carImages.length === 0) {
      setCarStatus("error");
      setCarErrorMsg("Lütfen en az bir resim yükleyin.");
      return;
    }

    setIsSubmittingCar(true);
    setCarStatus("idle");
    setCarErrorMsg("");

    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: "sazcar2026",
          title: carTitle,
          price: Number(carPrice),
          mileage: Number(carMileage),
          year: carYear,
          power: carPower,
          transmission: carTransmission,
          fuelType: carFuelType,
          mfk: carMfk,
          descriptionDe: carDescDe,
          descriptionTr: carDescTr,
          descriptionEn: carDescEn,
          images: carImages,
        }),
      });

      if (response.ok) {
        setCarStatus("success");
        setCarErrorMsg("");
        setCarTitle("");
        setCarPrice("");
        setCarMileage("");
        setCarYear("");
        setCarPower("");
        setCarMfk("");
        setCarDescDe("");
        setCarDescTr("");
        setCarDescEn("");
        setCarImages([]);
        fetchCars(); // reload list
      } else {
        const errData = await response.json().catch(() => ({}));
        setCarErrorMsg(errData.error || "Sunucu hatası veya eksik alan.");
        setCarStatus("error");
      }
    } catch (err: any) {
      setCarErrorMsg(err.message || "Ağ hatası veya bağlantı kesildi.");
      setCarStatus("error");
    } finally {
      setIsSubmittingCar(false);
    }
  };

  // --- JOB DELETE ---
  const handleDeleteJob = async (id: string | number) => {
    if (!window.confirm("Bu işi silmek istediğinizden emin misiniz?")) return;

    try {
      const response = await fetch("/api/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          passcode: "sazcar2026",
        }),
      });

      if (response.ok) {
        fetchJobs(); // reload list
      } else {
        alert("Silme işlemi başarısız oldu.");
      }
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Bir hata oluştu.");
    }
  };

  // --- CAR DELETE ---
  const handleDeleteCar = async (id: string) => {
    if (!window.confirm("Bu araç ilanını silmek istediğinizden emin misiniz?")) return;

    try {
      const response = await fetch("/api/cars", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          passcode: "sazcar2026",
        }),
      });

      if (response.ok) {
        fetchCars(); // reload list
      } else {
        alert("Silme işlemi başarısız oldu.");
      }
    } catch (err) {
      console.error("Error deleting car:", err);
      alert("Bir hata oluştu.");
    }
  };

  // Login view
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 font-sans text-white dark-carbon-bg">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-white shadow-lg">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-wider">
              {t.admin.title}
            </h1>
            <p className="text-sm text-zinc-400">
              {t.admin.passcodeLabel}
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 text-center text-lg font-black tracking-widest outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />

            {authError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-600/10 border border-red-600/20 p-3 text-xs font-bold text-red-500 justify-center">
                <AlertCircle size={14} />
                <span>{t.admin.loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-600 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200"
            >
              {t.admin.btnLogin}
            </button>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-300 pt-2 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Geri Dön</span>
            </Link>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans dark-carbon-bg pb-12">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/90 py-4 px-6 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wider uppercase">SAZCAR ADMIN</span>
            <span className="text-xs font-bold text-orange-500 tracking-wider">Hızlı İş Yükleme Paneli</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
            >
              Siteyi Gör
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-all shadow-md"
            >
              <LogOut size={14} />
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pt-8">
        
        {/* Navigation Tabs */}
        <div className="flex gap-6 border-b border-zinc-800 pb-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("jobs")}
            className={`pb-2 text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "jobs"
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Onarım Galerisi (Öncesi/Sonrası)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cars")}
            className={`pb-2 text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "cars"
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Satılık Araçlar (Oto Galeri)
          </button>
        </div>

        {/* Tab contents grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* TAB 1: REPAIR JOBS */}
          {activeTab === "jobs" && (
            <>
              {/* Form (Left 2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-md">
                  <h2 className="text-lg font-black tracking-wider uppercase text-orange-500 mb-6">
                    Yeni Öncesi/Sonrası Fotoğrafı Ekle
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Car Brand / Model */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                        Araç Marka / Model (İsteğe Bağlı)
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: BMW 320i veya Golf 7 (Boş bırakırsanız Proje # numarası gösterilir)"
                        value={carModel}
                        onChange={(e) => setCarModel(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all"
                      />
                    </div>

                    {/* Title German */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                          {t.admin.fieldTitleDe} *
                        </label>
                        {titleDe && (
                          <button
                            type="button"
                            onClick={() => handleTranslate("de")}
                            disabled={!!isTranslating}
                            className="text-[10px] font-extrabold text-orange-500 hover:text-orange-400 disabled:text-zinc-600 uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md"
                          >
                            {isTranslating === "de" ? "Çevriliyor..." : "Diğer Dillere Çevir"}
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="z.B. Blechschaden repariert"
                        value={titleDe}
                        onChange={(e) => setTitleDe(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all"
                      />
                    </div>

                    {/* Title Turkish */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                          {t.admin.fieldTitleTr} *
                        </label>
                        {titleTr && (
                          <button
                            type="button"
                            onClick={() => handleTranslate("tr")}
                            disabled={!!isTranslating}
                            className="text-[10px] font-extrabold text-orange-500 hover:text-orange-400 disabled:text-zinc-600 uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md"
                          >
                            {isTranslating === "tr" ? "Çevriliyor..." : "Diğer Dillere Çevir"}
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Örn: Kaporta yamuğu düzeltildi"
                        value={titleTr}
                        onChange={(e) => setTitleTr(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all"
                      />
                    </div>

                    {/* Title English */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                          {t.admin.fieldTitleEn} *
                        </label>
                        {titleEn && (
                          <button
                            type="button"
                            onClick={() => handleTranslate("en")}
                            disabled={!!isTranslating}
                            className="text-[10px] font-extrabold text-orange-500 hover:text-orange-400 disabled:text-zinc-600 uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md"
                          >
                            {isTranslating === "en" ? "Çevriliyor..." : "Diğer Dillere Çevir"}
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bodywork repair"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all"
                      />
                    </div>

                    {/* Before & After Upload Fields */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {/* Before Image */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                          {t.admin.fieldBeforeImg} *
                        </label>
                        <div className="relative flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950 hover:bg-zinc-900/50 transition-all">
                          {beforeImg ? (
                            <div className="relative h-full w-full rounded-xl overflow-hidden">
                              <img src={beforeImg} alt="Before Preview" className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setBeforeImg(null)}
                                className="absolute top-1.5 right-1.5 rounded-full bg-red-600 p-1 text-white opacity-85 hover:opacity-100 hover:scale-105 transition-all shadow-md"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-7 w-7 text-zinc-600 mb-1.5" />
                              <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">{t.admin.btnSelectPhoto}</span>
                              <input
                                type="file"
                                required
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "before")}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </>
                          )}
                        </div>
                      </div>

                      {/* After Image */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                          {t.admin.fieldAfterImg} *
                        </label>
                        <div className="relative flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950 hover:bg-zinc-900/50 transition-all">
                          {afterImg ? (
                            <div className="relative h-full w-full rounded-xl overflow-hidden">
                              <img src={afterImg} alt="After Preview" className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setAfterImg(null)}
                                className="absolute top-1.5 right-1.5 rounded-full bg-red-600 p-1 text-white opacity-85 hover:opacity-100 hover:scale-105 transition-all shadow-md"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-7 w-7 text-zinc-600 mb-1.5" />
                              <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">{t.admin.btnSelectPhoto}</span>
                              <input
                                type="file"
                                required
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "after")}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !beforeImg || !afterImg}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      {isSubmitting ? "Yayınlanıyor..." : t.admin.btnAddJob}
                    </button>

                    {/* Feedback Notifications */}
                    {status === "success" && (
                      <div className="flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-green-400">
                        <CheckCircle className="h-5 w-5 shrink-0" />
                        <span className="text-sm font-bold">{t.admin.successAdd}</span>
                      </div>
                    )}

                    {status === "error" && (
                      <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-400">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span className="text-sm font-bold">{t.admin.errorAdd}</span>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Sidebar List (Right 1 col) */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-md">
                  <h2 className="text-lg font-black tracking-wider uppercase text-orange-500 mb-6">
                    Yayınlanan İşler ({existingJobs.length})
                  </h2>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                    {existingJobs.length === 0 ? (
                      <p className="text-sm text-zinc-500">Henüz yayınlanmış iş bulunmuyor.</p>
                    ) : (
                      existingJobs.map((job) => (
                        <div
                          key={job.id}
                          className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 items-center justify-between"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0">
                              <img src={job.afterImage} alt="After thumbnail" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-zinc-300 truncate">
                                {job.titleTr}
                              </span>
                              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-0.5">
                                ID: {typeof job.id === 'string' ? job.id.substring(0, 8) + '...' : job.id}
                              </span>
                            </div>
                          </div>

                          {/* Delete button (Only for Supabase database-backed jobs) */}
                          {typeof job.id === 'string' && (
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/35 transition-all cursor-pointer flex items-center justify-center active:scale-95 shrink-0"
                              title="İşi Sil"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: CAR SALES */}
          {activeTab === "cars" && (
            <>
              {/* Form (Left 2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-md">
                  <h2 className="text-lg font-black tracking-wider uppercase text-orange-500 mb-6">
                    Yeni Satılık Araç İlanı Ekle
                  </h2>

                  <form onSubmit={handleCarSubmit} className="space-y-5">
                    {/* Brand / Model / Title */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                        Araç Başlığı / Marka & Model *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: BMW 135i Cabrio Steptronic"
                        value={carTitle}
                        onChange={(e) => setCarTitle(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all"
                      />
                    </div>

                    {/* Numeric Specifications Grid */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {/* Price */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                          Fiyat (CHF) *
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="Örn: 7950"
                          value={carPrice}
                          onChange={(e) => setCarPrice(e.target.value)}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all"
                        />
                      </div>

                      {/* Mileage */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                          Kilometre (km) *
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="Örn: 211000"
                          value={carMileage}
                          onChange={(e) => setCarMileage(e.target.value)}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all"
                        />
                      </div>

                      {/* Registration Year */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                          İlk Tescil (Ay.Yıl) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Örn: 03.2009"
                          value={carYear}
                          onChange={(e) => setCarYear(e.target.value)}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Technical Specs Grid */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      {/* Engine Power */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                          Motor Gücü *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Örn: 306 PS"
                          value={carPower}
                          onChange={(e) => setCarPower(e.target.value)}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all"
                        />
                      </div>

                      {/* Transmission */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                          Vites Türü *
                        </label>
                        <select
                          value={carTransmission}
                          onChange={(e) => setCarTransmission(e.target.value)}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all"
                        >
                          <option value="Automat">Automat (Otomatik)</option>
                          <option value="Schaltgetriebe">Schaltgetriebe (Manuel)</option>
                        </select>
                      </div>

                      {/* Fuel Type */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                          Yakıt Türü *
                        </label>
                        <select
                          value={carFuelType}
                          onChange={(e) => setCarFuelType(e.target.value)}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all"
                        >
                          <option value="Benzin">Benzin</option>
                          <option value="Diesel">Diesel (Dizel)</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="Elektro">Elektro</option>
                        </select>
                      </div>

                      {/* MFK Date */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                          MFK Durumu / Tarih *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Örn: Ab MFK 08.2024"
                          value={carMfk}
                          onChange={(e) => setCarMfk(e.target.value)}
                          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Descriptions Section */}
                    <div className="border-t border-zinc-800 pt-5 space-y-5">
                      <h3 className="text-xs font-black tracking-wider uppercase text-orange-500 flex items-center gap-1.5">
                        <Globe size={14} />
                        <span>Araç Açıklaması / Detaylar</span>
                      </h3>

                      {/* German Description */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                            Açıklama (Almanca)
                          </label>
                          {carDescDe && (
                            <button
                              type="button"
                              onClick={() => handleCarTranslate("de")}
                              disabled={!!isTranslatingCar}
                              className="text-[10px] font-extrabold text-orange-500 hover:text-orange-400 disabled:text-zinc-600 uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md"
                            >
                              {isTranslatingCar === "de" ? "Çevriliyor..." : "Diğer Dillere Çevir"}
                            </button>
                          )}
                        </div>
                        <textarea
                          placeholder="z.B. Komplett neu Bremsen Vorne und Hinten..."
                          value={carDescDe}
                          onChange={(e) => setCarDescDe(e.target.value)}
                          className="w-full h-24 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all resize-none"
                        />
                      </div>

                      {/* Turkish Description */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                            Açıklama (Türkçe)
                          </label>
                          {carDescTr && (
                            <button
                              type="button"
                              onClick={() => handleCarTranslate("tr")}
                              disabled={!!isTranslatingCar}
                              className="text-[10px] font-extrabold text-orange-500 hover:text-orange-400 disabled:text-zinc-600 uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md"
                            >
                              {isTranslatingCar === "tr" ? "Çevriliyor..." : "Diğer Dillere Çevir"}
                            </button>
                          )}
                        </div>
                        <textarea
                          placeholder="Örn: Ön ve arka frenler tamamen yeni sıfır takıldı..."
                          value={carDescTr}
                          onChange={(e) => setCarDescTr(e.target.value)}
                          className="w-full h-24 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all resize-none"
                        />
                      </div>

                      {/* English Description */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                            Açıklama (İngilizce)
                          </label>
                          {carDescEn && (
                            <button
                              type="button"
                              onClick={() => handleCarTranslate("en")}
                              disabled={!!isTranslatingCar}
                              className="text-[10px] font-extrabold text-orange-500 hover:text-orange-400 disabled:text-zinc-600 uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md"
                            >
                              {isTranslatingCar === "en" ? "Çevriliyor..." : "Diğer Dillere Çevir"}
                            </button>
                          )}
                        </div>
                        <textarea
                          placeholder="e.g. Brand new front and rear brakes..."
                          value={carDescEn}
                          onChange={(e) => setCarDescEn(e.target.value)}
                          className="w-full h-24 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500 transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Image Upload Area */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                        Araç Fotoğrafları (En az 1 resim yükleyin veya sürükleyin) *
                      </label>
                      <div className="relative flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950 hover:bg-zinc-900/50 transition-all">
                        <Upload className="h-6 w-6 text-zinc-600 mb-1" />
                        <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Birden Fazla Resim Seçin</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleCarFilesChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>

                      {/* Display Selected Image Previews */}
                      {carImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-3 mt-3 max-h-48 overflow-y-auto p-1 border border-zinc-800/40 rounded-xl bg-zinc-900/10">
                          {carImages.map((img, idx) => (
                            <div key={idx} className="relative h-20 rounded-lg overflow-hidden border border-zinc-800 group">
                              <img src={img} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setCarImages((prev) => prev.filter((_, i) => i !== idx))}
                                className="absolute top-1 right-1 rounded-full bg-red-600 p-0.5 text-white opacity-85 hover:opacity-100 transition-all shadow-md"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmittingCar || carImages.length === 0}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      {isSubmittingCar ? "İlan Yayınlanıyor..." : "Satılık İlanı Yayınla"}
                    </button>

                    {/* Feedback Notifications */}
                    {carStatus === "success" && (
                      <div className="flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-green-400">
                        <CheckCircle className="h-5 w-5 shrink-0" />
                        <span className="text-sm font-bold">Araç ilanı başarıyla yayınlandı!</span>
                      </div>
                    )}

                    {carStatus === "error" && (
                      <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-400">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">İlan eklenirken bir hata oluştu.</span>
                          {carErrorMsg && <span className="text-xs font-semibold mt-0.5 opacity-90">{carErrorMsg}</span>}
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Sidebar List (Right 1 col) */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-md">
                  <h2 className="text-lg font-black tracking-wider uppercase text-orange-500 mb-6">
                    Yayınlanan İlanlar ({existingCars.length})
                  </h2>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                    {existingCars.length === 0 ? (
                      <p className="text-sm text-zinc-500">Henüz satılık araç ilanı bulunmuyor.</p>
                    ) : (
                      existingCars.map((car) => (
                        <div
                          key={car.id}
                          className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 items-center justify-between"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0">
                              <img src={car.imageUrls[0]} alt="Car thumbnail" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-zinc-300 truncate">
                                {car.title}
                              </span>
                              <span className="text-[10px] text-orange-500 font-extrabold mt-0.5">
                                CHF {car.price.toLocaleString("de-CH")}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteCar(car.id)}
                            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/35 transition-all cursor-pointer flex items-center justify-center active:scale-95 shrink-0"
                            title="İlanı Sil"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
