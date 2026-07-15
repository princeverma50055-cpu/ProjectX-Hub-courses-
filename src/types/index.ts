export interface LessonView {
  lessonId: string;
  title: string;
  content: string;
  durationMinutes: number;
  order: number;
}

export interface ChapterView {
  chapterId: string;
  title: string;
  order: number;
  lessons: LessonView[];
}

export interface CourseView {
  _id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  instructor: { name: string; title: string; avatar?: string };
  price: number;
  chapters: ChapterView[];
  totalLessons: number;
  certificateEnabled: boolean;
}

export interface ProgressView {
  completedLessons: string[];
  percentComplete: number;
  certificateUnlocked: boolean;
  certificateId?: string;
}
