import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Course from "@/models/Course";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await req.json();
  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  await connectDB();

  const course = await Course.findById(courseId).select("price").lean();
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }
  if (course.price > 0) {
    return NextResponse.json(
      { error: "This is a paid course — use the UPI checkout instead" },
      { status: 400 }
    );
  }

  await User.findByIdAndUpdate(authUser.userId, {
    $addToSet: { enrolledCourses: courseId },
  });
  await Course.findByIdAndUpdate(courseId, { $inc: { enrollCount: 1 } });

  return NextResponse.json({ success: true });
}
