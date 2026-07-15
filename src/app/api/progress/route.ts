import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Progress, { CERTIFICATE_UNLOCK_THRESHOLD } from "@/models/Progress";
import Course from "@/models/Course";

export async function GET(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courseId = req.nextUrl.searchParams.get("courseId");
  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  await connectDB();

  const progress = await Progress.findOne({
    user: authUser.userId,
    course: courseId,
  }).lean();

  return NextResponse.json({
    progress: progress ?? {
      completedLessons: [],
      percentComplete: 0,
      certificateUnlocked: false,
    },
  });
}

export async function POST(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId, lessonId } = await req.json();
  if (!courseId || !lessonId) {
    return NextResponse.json(
      { error: "courseId and lessonId are required" },
      { status: 400 }
    );
  }

  await connectDB();

  const course = await Course.findById(courseId).select("totalLessons").lean();
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  let progress = await Progress.findOne({
    user: authUser.userId,
    course: courseId,
  });

  if (!progress) {
    progress = new (Progress as any)({
      user: authUser.userId,
      course: courseId,
      completedLessons: [],
    });
  }

  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  progress.lastVisitedLessonId = lessonId;

  const total = Math.max(course.totalLessons, 1);
  progress.percentComplete = Math.min(
    100,
    Math.round((progress.completedLessons.length / total) * 100)
  );

  const justUnlocked =
    progress.percentComplete >= CERTIFICATE_UNLOCK_THRESHOLD &&
    !progress.certificateUnlocked;

  if (justUnlocked) {
    progress.certificateUnlocked = true;
    progress.certificateIssuedAt = new Date();
    progress.certificateId = `PX-${courseId.slice(-6).toUpperCase()}-${Date.now()
      .toString(36)
      .toUpperCase()}`;
  }

  await progress.save();

  return NextResponse.json({ progress, justUnlocked });
}
