import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await connectDB();

  const course = await Course.findOne({
    slug: params.slug,
    isPublished: true,
  }).lean();

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json({ course });
}
