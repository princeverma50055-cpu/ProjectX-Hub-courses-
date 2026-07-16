"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import CourseCard from "@/components/catalog/CourseCard";

const CATEGORIES = [
  "All",
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
];

interface CourseListItem {
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  level: string;
  thumbnail: string;
  instructor: { name: string };
  price: number;
  ratingAverage: number;
  enrollCount: number;
  totalDurationMinutes: number;
}

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (category !== "All") params.set("category", category);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/courses?${params.toString()}`);
      const data = await res.json();
      setCourses(data.courses || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, [category, search, page]);

  useEffect(() => {
    const debounce = setTimeout(fetchCourses, 300);
    return () => clearTimeout(debounce);
  }, [fetchCourses]);

  useEffect(() => {
    setPage(1);
  }, [category, search]);

  return (
    <div className="min-h-screen bg-brand-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Explore 1000+ Courses
          </h1>
          <p className="text-slate-400 text-sm">
            Text-based, self-paced courses in AI, Web Dev, Python, and more —
            by ProjectX Hub.
          </p>
        </div>

        <div className="relative mb-5 max-w-md">
          <Search size={16} className="absolute left-3 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-800 border border-brand-700 rounded-lg pl-10 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={
                category === cat
                  ? "px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-accent text-white transition-colors"
                  : "px-4 py-1.5 rounded-full text-xs font-medium bg-brand-800 text-slate-400 border border-brand-700 hover:text-slate-200 transition-colors"
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 size={28} className="animate-spin text-brand-accentLight" />
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center text-slate-500 py-24 text-sm">
            No courses found. Try a different search or category.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {courses.map((course) => (
              <CourseCard key={course.slug} {...course} />
            ))}
          </motion.div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-brand-800 border border-brand-700 text-sm text-slate-300 disabled:opacity-40 hover:bg-brand-700 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-slate-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-brand-800 border border-brand-700 text-sm text-slate-300 disabled:opacity-40 hover:bg-brand-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
