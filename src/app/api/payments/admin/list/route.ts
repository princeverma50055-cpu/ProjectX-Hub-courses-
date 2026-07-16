import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser || authUser.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  await connectDB();

  const status = req.nextUrl.searchParams.get("status") || "awaiting_verification";

  const orders = await Order.find({ status })
    .populate("user", "name email")
    .populate("course", "title slug")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return NextResponse.json({ orders });
}
