import mongoose, { Schema, model, models, Document } from "mongoose";

export interface ILesson {
  lessonId: string;
  title: string;
  content: string;
  durationMinutes: number;
  order: number;
}

export interface IChapter {
  chapterId: string;
  title: string;
  order: number;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  category:
    | "JavaScript"
    | "Python"
    | "AI"
    | "Web Development"
    | "Data Science"
    | "DevOps"
    | "Cloud"
    | "Cybersecurity"
    | "Design"
    | "Business";
  tags: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string;
  instructor: {
    name: string;
    title: string;
    avatar?: string;
  };
  price: number;
  currency: "INR";
  isPublished: boolean;
  isFeatured: boolean;
  chapters: IChapter[];
  totalLessons: number;
  totalDurationMinutes: number;
  ratingAverage: number;
  ratingCount: number;
  enrollCount: number;
  certificateEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    lessonId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    durationMinutes: { type: Number, default: 5 },
    order: { type: Number, required: true },
  },
  { _id: false }
);

const ChapterSchema = new Schema<IChapter>(
  {
    chapterId: { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
    lessons: { type: [LessonSchema], default: [] },
  },
  { _id: false }
);

const CourseSchema = new Schema<ICourse>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: "text" },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: {
      type: String,
      required: true,
      index: true,
      enum: [
        "JavaScript",
        "Python",
        "AI",
        "Web Development",
        "Data Science",
        "DevOps",
        "Cloud",
        "Cybersecurity",
        "Design",
        "Business",
      ],
    },
    tags: { type: [String], default: [], index: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    thumbnail: { type: String, default: "/thumbnails/default.jpg" },
    instructor: {
      name: { type: String, required: true },
      title: { type: String, default: "Instructor" },
      avatar: { type: String },
    },
    price: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "INR" },
    isPublished: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    chapters: { type: [ChapterSchema], default: [] },
    totalLessons: { type: Number, default: 0 },
    totalDurationMinutes: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    enrollCount: { type: Number, default: 0 },
    certificateEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CourseSchema.pre("save", function (next) {
  const course = this as ICourse;
  let lessonCount = 0;
  let duration = 0;
  for (const ch of course.chapters) {
    lessonCount += ch.lessons.length;
    duration += ch.lessons.reduce((sum, l) => sum + l.durationMinutes, 0);
  }
  course.totalLessons = lessonCount;
  course.totalDurationMinutes = duration;
  next();
});

CourseSchema.index({ category: 1, isPublished: 1 });

export default (models.Course as mongoose.Model<ICourse>) ||
  model<ICourse>("Course", CourseSchema);
