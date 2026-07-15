"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { LessonView } from "@/types";

interface ChapterContentProps {
  lesson: LessonView;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  hasPrev: boolean;
  hasNext: boolean;
  isMarking?: boolean;
}

export default function ChapterContent({
  lesson,
  isCompleted,
  onMarkComplete,
  onNavigate,
  hasPrev,
  hasNext,
  isMarking,
}: ChapterContentProps) {
  return (
    <motion.article
      key={lesson.lessonId}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-4 sm:px-6 py-8"
    >
      <div className="mb-6">
        <span className="text-xs font-medium text-brand-accentLight uppercase tracking-wider">
          {lesson.durationMinutes} min read
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1.5">
          {lesson.title}
        </h1>
      </div>

      <div className="prose prose-invert prose-slate max-w-none prose-headings:text-white prose-a:text-brand-accentLight prose-code:text-brand-accentGlow prose-code:bg-brand-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-brand-800 prose-pre:border prose-pre:border-brand-700 whitespace-pre-wrap leading-relaxed text-slate-300">
        {lesson.content}
      </div>

      <div className="mt-10 pt-6 border-t border-brand-700 flex items-center justify-between gap-3">
        <button
          onClick={() => onNavigate("prev")}
          disabled={!hasPrev}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <button
          onClick={onMarkComplete}
          disabled={isCompleted || isMarking}
          className={
            isCompleted
              ? "flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-success/15 text-brand-success text-sm font-semibold cursor-default"
              : "flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-accent text-white text-sm font-semibold hover:bg-brand-accentLight shadow-glow transition-colors disabled:opacity-60"
          }
        >
          <CheckCircle2 size={16} />
          {isCompleted ? "Completed" : isMarking ? "Saving..." : "Mark as Complete"}
        </button>

        <button
          onClick={() => onNavigate("next")}
          disabled={!hasNext}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </motion.article>
  );
}
