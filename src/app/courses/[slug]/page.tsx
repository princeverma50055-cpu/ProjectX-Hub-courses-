"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Clock,
  CheckCircle2,
  Loader2,
  Award,
  PlayCircle,
} from "lucide-react";
import UpiPaymentModal from "@/components/payment/UpiPaymentModal";
import { CourseView } from "@/types";

interface CurrentUser {
  id: string;
  name: string;
  enrolledCourses: string[];
}

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<CourseView | null>(null);
  const [user, setUser] = useState<CurrentUser | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    (async () => {
      const [courseRes, meRes] = await Promise.all([
        fetch(`/api/courses/${slug}`),
        fetch("/api/auth/me"),
      ]);
      if (courseRes.ok) {
        const data = await courseRes.json();
        setCourse(data.course);
      }
      if (meRes.ok) {
        const data = await meRes.json();
        setUser(data.user);
      }
      setLoading(false);
    })();
  }, [slug]);

  const isEnrolled = !!(
    course &&
    user &&
    user.enrolledCourses.includes(course._id)
  );

  const firstLessonId = course?.chapters
    .sort((a, b) => a.order - b.order)[0]
    ?.lessons.sort((a, b) => a.order - b.order)[0]?.lessonId;

  const handlePrimaryAction = async () => {
    if (!course) return;

    if (user === null) {
      router.push(`/login?redirect=/courses/${slug}`);
      return;
    }

    if (isEnrolled) {
      if (firstLessonId) router.push(`/courses/${slug}/${firstLessonId}`);
      return;
    }

    if (course.price > 0) {
      setShowPayment(true);
      return;
    }

    setEnrolling(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course._id }),
      });
      if (res.ok) {
        setUser((prev) =>
          prev ? { ...prev, enrolledCourses: [...prev.enrolledCourses, course._id] } : prev
        );
        if (firstLessonId) router.push(`/courses/${slug}/${firstLessonId}`);
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading || !course) {
    return (
      <div className="min-h-screen bg-brand-gradient flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-brand-accentLight" />
      </div>
    );
  }

  const totalLessons = course.totalLessons;
  const totalChapters = course.chapters.length;

  return (
    <div className="min-h-screen bg-brand-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-accentLight">
            {course.category} &middot; {course.level}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-3">
            {course.title}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {course.description}
          </p>

          <div className="flex items-center gap-5 text-xs text-slate-500 mb-8 pb-6 border-b border-brand-700">
            <span className="flex items-center gap-1.5">
              <Users size={14} /> {course.instructor.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {totalChapters} chapters &middot; {totalLessons} lessons
            </span>
            {course.certificateEnabled && (
              <span className="flex items-center gap-1.5">
                <Award size={14} /> Certificate on completion
              </span>
            )}
          </div>

          <h2 className="text-lg font-semibold text-white mb-4">Course Content</h2>
          <div className="space-y-2">
            {course.chapters
              .sort((a, b) => a.order - b.order)
              .map((chapter, idx) => (
                <motion.div
                  key={chapter.chapterId}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  className="bg-brand-800 border border-brand-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-200">
                      {idx + 1}. {chapter.title}
                    </span>
                    <span className="text-xs text-slate-500">
                      {chapter.lessons.length} lessons
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {chapter.lessons
                      .sort((a, b) => a.order - b.order)
                      .map((lesson) => (
                        <li
                          key={lesson.lessonId}
                          className="flex items-center gap-2 text-xs text-slate-500 pl-1"
                        >
                          <PlayCircle size={12} className="text-slate-600 shrink-0" />
                          {lesson.title}
                          <span className="ml-auto text-slate-600">
                            {lesson.durationMinutes}m
                          </span>
                        </li>
                      ))}
                  </ul>
                </motion.div>
              ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-10 bg-brand-800 border border-brand-700 rounded-2xl p-6 shadow-card">
            <p className="text-3xl font-bold text-white mb-1">
              {course.price === 0 ? "Free" : `₹${course.price.toLocaleString("en-IN")}`}
            </p>
            <p className="text-xs text-slate-500 mb-5">
              {course.price === 0
                ? "No payment required"
                : "One-time payment via UPI"}
            </p>

            <button
              onClick={handlePrimaryAction}
              disabled={enrolling}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-brand-accent hover:bg-brand-accentLight text-white text-sm font-semibold shadow-glow transition-colors disabled:opacity-60 mb-4"
            >
              {enrolling && <Loader2 size={16} className="animate-spin" />}
              {isEnrolled
                ? "Continue Learning"
                : enrolling
                ? "Enrolling..."
                : course.price === 0
                ? "Enroll for Free"
                : "Enroll Now — Pay with UPI"}
            </button>

            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-brand-success shrink-0" />
                Lifetime access to {totalLessons} lessons
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-brand-success shrink-0" />
                Learn at your own pace
              </li>
              {course.certificateEnabled && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-success shrink-0" />
                  Verified certificate at 80% completion
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {showPayment && (
        <UpiPaymentModal
          courseId={course._id}
          courseTitle={course.title}
          price={course.price}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
