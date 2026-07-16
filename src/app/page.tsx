"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, BookOpen, Sparkles, Users } from "lucide-react";

const STATS = [
  { label: "Courses", value: "1000+", icon: BookOpen },
  { label: "Categories", value: "10", icon: Sparkles },
  { label: "Verified Certificates", value: "100%", icon: Award },
  { label: "Learners", value: "Growing daily", icon: Users },
];

const CATEGORIES = [
  "JavaScript",
  "Python",
  "AI",
  "Web Development",
  "Data Science",
  "DevOps",
  "Cloud",
  "Cybersecurity",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-gradient overflow-hidden">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-6">
        <span className="text-lg font-bold text-white tracking-tight">
          PROJECTX <span className="text-brand-accentLight">COURSES</span>
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-brand-accent hover:bg-brand-accentLight text-white transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto text-center px-4 sm:px-6 pt-16 pb-20">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-block text-xs font-semibold tracking-wide uppercase text-brand-accentLight bg-brand-accent/10 border border-brand-accent/30 px-3 py-1.5 rounded-full mb-6"
        >
          By ProjectX Hub
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-6"
        >
          Learn. Build.
          <br />
          <span className="text-brand-accentLight">Get Certified.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-10"
        >
          1000+ premium, text-based courses in AI, Web Development, Python,
          and more. Learn at your own pace and earn a verified certificate,
          signed by ProjectX Hub.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-3"
        >
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-brand-accent hover:bg-brand-accentLight text-white text-sm font-semibold shadow-glow transition-colors"
          >
            Browse Courses <ArrowRight size={16} />
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-brand-800 border border-brand-700 hover:border-brand-accent/50 text-slate-200 text-sm font-semibold transition-colors"
          >
            Create Free Account
          </Link>
        </motion.div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-brand-800/60 border border-brand-700 rounded-xl p-5 text-center"
            >
              <stat.icon size={20} className="mx-auto text-brand-accentLight mb-2" />
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <h2 className="text-center text-2xl font-bold text-white mb-8">
          Explore by Category
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                href={`/courses?category=${encodeURIComponent(cat)}`}
                className="inline-block px-5 py-2.5 rounded-full bg-brand-800 border border-brand-700 text-sm text-slate-300 hover:text-white hover:border-brand-accent/50 hover:bg-brand-accent/10 transition-all"
              >
                {cat}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-brand-700 py-8">
        <p className="text-center text-xs text-slate-600">
          © {new Date().getFullYear()} ProjectX Hub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
