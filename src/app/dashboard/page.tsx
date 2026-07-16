"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, Loader2, BookOpen, PlayCircle, CheckCircle2 } from "lucide-react";

interface DashboardCourseItem {
  course: {
    _id: string;
    slug: string;
    title: string;
    thumbnail: string;
    category: string;
    level: string;
    instructor: { name: string };
    totalLessons: number;
    certificateEnabled: boolean;
  };
  percentComplete: number;
  certificateUnlocked: boolean;
  lastVisitedLessonId: string | null;
}

interface DashboardData {
  name: string;
  stats: { totalEnrolled: number; completed: number; certificatesEarned: number };
  courses: DashboardCourseItem[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/dashboard");
      if (res.status === 401) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      const json = await res.json();
      setData(json);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-gradient flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-brand-accentLight" />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-brand-gradient flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-white font-semibold mb-2">You're not logged in</p>
          <Link
            href="/login?redirect=/dashboard"
            className="text-sm text-brand-accentLight hover:underline"
          >
            Log in to see your courses
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-brand-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back, {data.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Pick up where you left off.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg">
          <div className="bg-brand-800 border border-brand-700 rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-white">{data.stats.totalEnrolled}</p>
            <p className="text-[11px] text-slate-500 mt-1">Enrolled</p>
          </div>
          <div className="bg-brand-800 border border-brand-700 rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-white">{data.stats.completed}</p>
            <p className="text-[11px] text-slate-500 mt-1">Completed</p>
          </div>
          <div className="bg-brand-800 border border-brand-700 rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-brand-gold">
              {data.stats.certificatesEarned}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Certificates</p>
          </div>
        </div>

        {data.courses.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen size={32} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 text-sm mb-4">
              You haven't enrolled in any courses yet.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-accentLight hover:underline"
            >
              Browse courses <PlayCircle size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.courses.map((item, i) => {
              const continueHref = item.lastVisitedLessonId
                ? `/courses/${item.course.slug}/${item.lastVisitedLessonId}`
                : `/courses/${item.course.slug}`;

              return (
                <motion.div
                  key={item.course._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="bg-brand-800 border border-brand-700 rounded-xl overflow-hidden"
                >
                  <div className="aspect-video bg-brand-700 relative">
                    <img
                      src={item.course.thumbnail}
                      alt={item.course.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase bg-brand-900/80 text-brand-accentLight px-2 py-1 rounded">
                      {item.course.category}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white line-clamp-2 mb-3 min-h-[2.5rem]">
                      {item.course.title}
                    </h3>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-slate-500">Progress</span>
                        <span className="text-[11px] font-semibold text-brand-accentLight">
                          {item.percentComplete}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-brand-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-accentGlow"
                          style={{ width: `${item.percentComplete}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={continueHref}
                        className="flex-1 text-center text-xs font-semibold py-2 rounded-lg bg-brand-accent hover:bg-brand-accentLight text-white transition-colors"
                      >
                        {item.percentComplete === 0 ? "Start" : "Continue"}
                      </Link>

                      {item.certificateUnlocked ? (
                        <Link
                          href={`/certificate/${item.course._id}`}
                          className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-gold/15 border border-brand-gold/30 text-brand-gold shrink-0"
                          title="Download certificate"
                        >
                          <Award size={14} />
                        </Link>
                      ) : item.percentComplete === 100 ? (
                        <span
                          className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-success/15 border border-brand-success/30 text-brand-success shrink-0"
                          title="Completed"
                        >
                          <CheckCircle2 size={14} />
                        </span>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
