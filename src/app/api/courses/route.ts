import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "20", 10));

  const query: Record<string, unknown> = { isPublished: true };
  if (category) query.category = category;
  if (search) query.$text = { $search: search };

  const [courses, total] = await Promise.all([
    Course.find(query)
      .select(
        "slug title shortDescription category level thumbnail instructor price ratingAverage enrollCount totalLessons totalDurationMinutes"
      )
      .sort({ isFeatured: -1, enrollCount: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Course.countDocuments(query),
  ]);

  return NextResponse.json({
    courses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
