import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import User from "@/models/User";
import Progress from "@/models/Progress";

export async function GET(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(authUser.userId)
    .populate({
      path: "enrolledCourses",
      select:
        "slug title thumbnail category level instructor totalLessons certificateEnabled",
    })
    .lean();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const courseIds = user.enrolledCourses.map((c: any) => c._id);

  const progressDocs = await Progress.find({
    user: authUser.userId,
    course: { $in: courseIds },
  }).lean();

  const progressByCourse = new Map(
    progressDocs.map((p) => [p.course.toString(), p])
  );

  const items = user.enrolledCourses.map((course: any) => {
    const progress = progressByCourse.get(course._id.toString());
    return {
      course: {
        _id: course._id,
        slug: course.slug,
        title: course.title,
        thumbnail: course.thumbnail,
        category: course.category,
        level: course.level,
        instructor: course.instructor,
        totalLessons: course.totalLessons,
        certificateEnabled: course.certificateEnabled,
      },
      percentComplete: progress?.percentComplete ?? 0,
      certificateUnlocked: progress?.certificateUnlocked ?? false,
      lastVisitedLessonId: progress?.lastVisitedLessonId ?? null,
    };
  });

  return NextResponse.json({
    name: user.name,
    stats: {
      totalEnrolled: items.length,
      completed: items.filter((i) => i.percentComplete >= 100).length,
      certificatesEarned: items.filter((i) => i.certificateUnlocked).length,
    },
    courses: items,
  });
}
