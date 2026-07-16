import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser || authUser.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { orderId } = await req.json();
  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  await connectDB();

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status: "failed" },
    { new: true }
  );

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, order });
}
