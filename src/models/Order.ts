import mongoose, { Schema, model, models, Document } from "mongoose";

export type OrderStatus =
  | "pending"
  | "awaiting_verification"
  | "paid"
  | "failed"
  | "expired";

export interface IOrder extends Document {
  orderRef: string;
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  amount: number;
  currency: "INR";
  status: OrderStatus;
  utr?: string;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderRef: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["pending", "awaiting_verification", "paid", "failed", "expired"],
      default: "pending",
      index: true,
    },
    utr: { type: String },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

export default (models.Order as mongoose.Model<IOrder>) ||
  model<IOrder>("Order", OrderSchema);
