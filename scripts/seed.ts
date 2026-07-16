import "dotenv/config";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Course from "../src/models/Course";

interface SeedLesson {
  lessonId: string;
  title: string;
  content: string;
  durationMinutes: number;
  order: number;
}

interface SeedChapter {
  chapterId: string;
  title: string;
  order: number;
  lessons: SeedLesson[];
}

interface SeedCourse {
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  tags?: string[];
  level?: string;
  thumbnail?: string;
  instructor: { name: string; title?: string; avatar?: string };
  price: number;
  isFeatured?: boolean;
  chapters: SeedChapter[];
}

function getFileArg(): string {
  const arg = process.argv.find((a) => a.startsWith("--file="));
  const filename = arg ? arg.split("=")[1] : "courses-seed-data.json";
  return path.resolve(__dirname, filename);
}

function validateCourse(course: SeedCourse, index: number): string[] {
  const errors: string[] = [];
  if (!course.slug) errors.push(`Course #${index}: missing "slug"`);
  if (!course.title) errors.push(`Course #${index}: missing "title"`);
  if (!course.category) errors.push(`Course #${index}: missing "category"`);
  if (!course.chapters || course.chapters.length === 0) {
    errors.push(`Course #${index} (${course.slug}): needs at least one chapter`);
  }
  course.chapters?.forEach((ch, ci) => {
    if (!ch.lessons || ch.lessons.length === 0) {
      errors.push(
        `Course #${index} (${course.slug}) → Chapter #${ci} (${ch.title}): needs at least one lesson`
      );
    }
  });
  return errors;
}

async function seed() {
  const filePath = getFileArg();

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Seed file not found: ${filePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  let courses: SeedCourse[];

  try {
    courses = JSON.parse(raw);
  } catch (err) {
    console.error("❌ Invalid JSON in seed file:", err);
    process.exit(1);
  }

  if (!Array.isArray(courses)) {
    console.error("❌ Seed file must contain a JSON array of courses.");
    process.exit(1);
  }

  const allErrors = courses.flatMap((c, i) => validateCourse(c, i));
  if (allErrors.length > 0) {
    console.error(`❌ Found ${allErrors.length} validation error(s):\n`);
    allErrors.forEach((e) => console.error(`   - ${e}`));
    process.exit(1);
  }

  console.log(`📦 Loaded ${courses.length} course(s) from ${path.basename(filePath)}`);
  console.log("🔌 Connecting to MongoDB...");

  await mongoose.connect(process.env.MONGODB_URI as string);

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const course of courses) {
    try {
      const result = await Course.findOneAndUpdate(
        { slug: course.slug },
        {
          ...course,
          isPublished: true,
          currency: "INR",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true, rawResult: true }
      );

      if (result.lastErrorObject?.updatedExisting) {
        updated++;
        console.log(`   ↻ Updated: ${course.title}`);
      } else {
        created++;
        console.log(`   ✓ Created: ${course.title}`);
      }
    } catch (err) {
      failed++;
      console.error(`   ✗ Failed: ${course.title}`, err);
    }
  }

  console.log("\n✅ Seed complete:");
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Failed:  ${failed}`);
  console.log(`   Total in file: ${courses.length}`);

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

seed().catch((err) => {
  console.error("❌ Seed script crashed:", err);
  process.exit(1);
});
