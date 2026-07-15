"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import CourseSidebar from "@/components/course/CourseSidebar";
import ProgressBar from "@/components/course/ProgressBar";
import ChapterContent from "@/components/course/ChapterContent";
import { CourseView, ProgressView } from "@/types";

export default function CourseViewerPage() {
  const router = useRouter();
  const params = useParams<{ slug: string; chapterId: string }>();
  const { slug, chapterId: activeLessonId } = params;

  const [course, setCourse] = useState<CourseView | null>(null);
  const [progress, setProgress] = useState<ProgressView>({
    completedLessons: [],
    percentComplete: 0,
    certificateUnlocked: false,
  });
  const [loading, setLoading] = useState(true);
  const [isMarking, setIsMarking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/courses/${slug}`);
      if (!res.ok) return;
      const data = await res.json();
      if (!cancelled) setCourse(data.course);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!course?._id) return;
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/progress?courseId=${course._id}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!cancelled) {
        setProgress(data.progress);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [course?._id]);

  const flatLessons = useMemo(() => {
    if (!course) return [];
    return course.chapters
      .sort((a, b) => a.order - b.order)
      .flatMap((ch) => ch.lessons.sort((a, b) => a.order - b.order));
  }, [course]);

  const activeIndex = flatLessons.findIndex((l) => l.lessonId === activeLessonId);
  const activeLesson = flatLessons[activeIndex];

  const handleMarkComplete = useCallback(async () => {
    if (!course?._id || !activeLesson) return;
    setIsMarking(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course._id, lessonId: activeLesson.lessonId }),
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress);
      }
    } finally {
      setIsMarking(false);
    }
  }, [course?._id, activeLesson]);

  const handleNavigate = useCallback(
    (direction: "prev" | "next") => {
      const targetIndex = direction === "prev" ? activeIndex - 1 : activeIndex + 1;
      const target = flatLessons[targetIndex];
      if (target) router.push(`/courses/${slug}/${target.lessonId}`);
    },
    [activeIndex, flatLessons, router, slug]
  );

  const handleDownloadCertificate = () => {
    if (course?._id) router.push(`/certificate/${course._id}`);
  };

  if (loading || !course || !activeLesson) {
    return (
      <div className="min-h-screen bg-brand-gradient flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gradient flex flex-col">
      <ProgressBar
        percent={progress.percentComplete}
        certificateUnlocked={progress.certificateUnlocked}
        onDownloadCertificate={handleDownloadCertificate}
      />

      <div className="flex flex-1 overflow-hidden">
        <CourseSidebar
          courseSlug={slug}
          chapters={course.chapters}
          completedLessons={progress.completedLessons}
          activeLessonId={activeLessonId}
        />

        <main className="flex-1 overflow-y-auto">
          <ChapterContent
            lesson={activeLesson}
            isCompleted={progress.completedLessons.includes(activeLesson.lessonId)}
            onMarkComplete={handleMarkComplete}
            onNavigate={handleNavigate}
            hasPrev={activeIndex > 0}
            hasNext={activeIndex < flatLessons.length - 1}
            isMarking={isMarking}
          />
        </main>
      </div>
    </div>
  );
}
