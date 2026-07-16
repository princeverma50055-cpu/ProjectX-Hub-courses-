"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Users, Clock } from "lucide-react";

interface CourseCardProps {
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

export default function CourseCard({
  slug,
  title,
  shortDescription,
  category,
  level,
  thumbnail,
  instructor,
  price,
  ratingAverage,
  enrollCount,
  totalDurationMinutes,
}: CourseCardProps) {
  const hours = Math.max(1, Math.round(totalDurationMinutes / 60));

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-brand-800 border border-brand-700 rounded-xl overflow-hidden hover:border-brand-accent/50 hover:shadow-glow transition-all"
    >
      <Link href={`/courses/${slug}`}>
        <div className="aspect-video bg-brand-700 relative overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wide bg-brand-900/80 text-brand-accentLight px-2 py-1 rounded">
            {category}
          </span>
          {price === 0 && (
            <span className="absolute top-2 right-2 text-[10px] font-semibold bg-brand-success/90 text-brand-950 px-2 py-1 rounded">
              FREE
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1.5 min-h-[2.5rem]">
            {title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mb-3 min-h-[2rem]">
            {shortDescription}
          </p>
          <p className="text-xs text-slate-500 mb-3">
            {instructor.name} &middot; {level}
          </p>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <Star size={12} className="fill-brand-gold text-brand-gold" />
              {ratingAverage.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} /> {enrollCount.toLocaleString("en-IN")}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {hours}h
            </span>
          </div>

          <div className="pt-3 border-t border-brand-700">
            <span className="text-base font-bold text-white">
              {price === 0 ? "Free" : `₹${price.toLocaleString("en-IN")}`}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
