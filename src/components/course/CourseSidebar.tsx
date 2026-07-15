"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, ChevronDown, PlayCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ChapterView } from "@/types";
import { cn } from "@/lib/utils";

interface CourseSidebarProps {
  courseSlug: string;
  chapters: ChapterView[];
  completedLessons: string[];
  activeLessonId: string;
}

export default function CourseSidebar({
  courseSlug,
  chapters,
  completedLessons,
  activeLessonId,
}: CourseSidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleChapter = (chapterId: string) =>
    setCollapsed((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-brand-900 border-r border-brand-700 h-full overflow-y-auto">
      <div className="p-4 border-b border-brand-700">
        <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">
          Course Content
        </p>
      </div>

      <nav className="p-2">
        {chapters
          .sort((a, b) => a.order - b.order)
          .map((chapter, idx) => {
            const isCollapsed = collapsed[chapter.chapterId];
            const chapterLessonIds = chapter.lessons.map((l) => l.lessonId);
            const doneCount = chapterLessonIds.filter((id) =>
              completedLessons.includes(id)
            ).length;

            return (
              <div key={chapter.chapterId} className="mb-1">
                <button
                  onClick={() => toggleChapter(chapter.chapterId)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-brand-800 transition-colors group"
                >
                  <div className="flex items-center gap-2 text-left">
                    <span className="text-xs font-semibold text-brand-accentLight bg-brand-800 rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                      {chapter.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-500">
                      {doneCount}/{chapterLessonIds.length}
                    </span>
                    <ChevronDown
                      size={14}
                      className={cn(
                        "text-slate-500 transition-transform",
                        !isCollapsed && "rotate-180"
                      )}
                    />
                  </div>
                </button>

                {!isCollapsed && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="pl-4 border-l border-brand-700 ml-5 overflow-hidden"
                  >
                    {chapter.lessons
                      .sort((a, b) => a.order - b.order)
                      .map((lesson) => {
                        const isDone = completedLessons.includes(lesson.lessonId);
                        const isActive = lesson.lessonId === activeLessonId;

                        return (
                          <li key={lesson.lessonId}>
                            <Link
                              href={`/courses/${courseSlug}/${lesson.lessonId}`}
                              className={cn(
                                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                                isActive
                                  ? "bg-brand-accent/15 text-brand-accentLight font-medium"
                                  : "text-slate-400 hover:text-slate-200 hover:bg-brand-800"
                              )}
                            >
                              {isDone ? (
                                <CheckCircle2
                                  size={16}
                                  className="text-brand-success shrink-0"
                                />
                              ) : isActive ? (
                                <PlayCircle
                                  size={16}
                                  className="text-brand-accentLight shrink-0"
                                />
                              ) : (
                                <Circle size={16} className="text-slate-600 shrink-0" />
                              )}
                              <span className="truncate">{lesson.title}</span>
                              <span className="ml-auto text-[11px] text-slate-600 shrink-0">
                                {lesson.durationMinutes}m
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                  </motion.ul>
                )}
              </div>
            );
          })}
      </nav>
    </aside>
  );
}
