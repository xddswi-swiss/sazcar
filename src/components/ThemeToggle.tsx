"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-10 w-20 cursor-pointer items-center justify-between rounded-full border border-zinc-200 bg-zinc-100 p-1 shadow-inner dark:border-zinc-800 dark:bg-zinc-900 select-none transition-colors duration-300"
      title="Toggle Theme"
    >
      {/* Sliding Knob */}
      <motion.div
        className="absolute left-1 h-7 w-7 rounded-full bg-white shadow-md dark:bg-zinc-950 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-800"
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          x: theme === "dark" ? 40 : 0,
        }}
      >
        {theme === "light" ? (
          <Sun size={14} className="text-amber-500 fill-amber-500 animate-pulse" />
        ) : (
          <Moon size={14} className="text-orange-500 fill-orange-500" />
        )}
      </motion.div>

      {/* Sun Icon (Left Side) */}
      <div className="z-10 flex h-7 w-7 items-center justify-center pl-1">
        <Sun
          size={14}
          className={`transition-colors duration-300 ${
            theme === "light" ? "text-amber-500 opacity-100" : "text-zinc-500 opacity-40"
          }`}
        />
      </div>

      {/* Moon Icon (Right Side) */}
      <div className="z-10 flex h-7 w-7 items-center justify-center pr-1">
        <Moon
          size={14}
          className={`transition-colors duration-300 ${
            theme === "dark" ? "text-orange-400 opacity-100" : "text-zinc-500 opacity-40"
          }`}
        />
      </div>
    </button>
  );
};
