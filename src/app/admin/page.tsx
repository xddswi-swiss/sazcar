"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { ArrowLeft, Lock, LogOut, CheckCircle, AlertCircle, Upload, Eye, FileImage, X } from "lucide-react";
import Link from "next/link";

interface Job {
  id: number;
  titleDe: string;
  titleTr: string;
  titleEn: string;
  beforeImage: string;
  afterImage: string;
  createdAt: string;
}

export default function AdminPage() {
  const { t } = useLanguage();
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Form states
  const [titleDe, setTitleDe] = useState("");
  const [titleTr, setTitleTr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [beforeImg, setBeforeImg] = useState<string | null>(null);
  const [afterImg, setAfterImg] = useState<string | null>(null);
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [existingJobs, setExistingJobs] = useState<Job[]>([]);

  // Check login on load
  useEffect(() => {
    const savedAuth = localStorage.getItem("sazcar_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
      fetchJobs();
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "sazcar2026") {
      setIsAuthenticated(true);
      localStorage.setItem("sazcar_admin_auth", "true");
      setAuthError(false);
      fetchJobs();
    } else {
      setAuthError(true);
      setPasscode("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("sazcar_admin_auth");
  };

  // Convert files to base64
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
        }),
      });

      if (response.ok) {
        setStatus("success");
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

      <main className="mx-auto max-w-5xl px-6 pt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Upload Form (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-md">
            <h2 className="text-lg font-black tracking-wider uppercase text-orange-500 mb-6">
              Yeni Proje Ekle
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title German */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  {t.admin.fieldTitleDe} *
                </label>
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
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  {t.admin.fieldTitleTr} *
                </label>
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
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  {t.admin.fieldTitleEn} *
                </label>
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

        {/* Existing Jobs List (Right 1 col) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-md">
            <h2 className="text-lg font-black tracking-wider uppercase text-orange-500 mb-6">
              Yayınlanan İşler ({existingJobs.length})
            </h2>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {existingJobs.length === 0 ? (
                <p className="text-sm text-zinc-500">Henüz yayınlanmış iş bulunmuyor.</p>
              ) : (
                existingJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 items-center"
                  >
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0">
                      <img src={job.afterImage} alt="After thumbnail" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-zinc-300 truncate">
                        {job.titleTr}
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-0.5">
                        ID: {job.id}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
