import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IProgress extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  completedLessons: string[];
  lastVisitedLessonId?: string;
  percentComplete: number;
  certificateUnlocked: boolean;
  certificateIssuedAt?: Date;
  certificateId?: string;
  startedAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    completedLessons: { type: [String], default: [] },
    lastVisitedLessonId: { type: String },
    percentComplete: { type: Number, default: 0, min: 0, max: 100 },
    certificateUnlocked: { type: Boolean, default: false },
    certificateIssuedAt: { type: Date },
    certificateId: { type: String, unique: true, sparse: true },
    startedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ProgressSchema.index({ user: 1, course: 1 }, { unique: true });

const CERTIFICATE_UNLOCK_THRESHOLD = 80;

ProgressSchema.methods.recalculate = function (totalLessons: number) {
  const doc = this as IProgress;
  const total = Math.max(totalLessons, 1);
  doc.percentComplete = Math.min(
    100,
    Math.round((doc.completedLessons.length / total) * 100)
  );

  if (
    doc.percentComplete >= CERTIFICATE_UNLOCK_THRESHOLD &&
    !doc.certificateUnlocked
  ) {
    doc.certificateUnlocked = true;
    doc.certificateIssuedAt = new Date();
    doc.certificateId = `PX-${doc.course.toString().slice(-6).toUpperCase()}-${Date.now()
      .toString(36)
      .toUpperCase()}`;
  }
};

export { CERTIFICATE_UNLOCK_THRESHOLD };

export default (models.Progress as mongoose.Model<IProgress>) ||
  model<IProgress>("Progress", ProgressSchema);
