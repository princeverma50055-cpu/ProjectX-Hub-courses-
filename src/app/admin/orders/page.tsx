"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, ShieldAlert } from "lucide-react";

interface PendingOrder {
  _id: string;
  orderRef: string;
  amount: number;
  utr: string;
  createdAt: string;
  user: { name: string; email: string };
  course: { title: string; slug: string };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/payments/admin/list?status=awaiting_verification");
    if (res.status === 403) {
      setForbidden(true);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleAction = async (orderId: string, action: "approve" | "reject") => {
    setProcessingId(orderId);
    try {
      const res = await fetch(`/api/payments/admin/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      }
    } finally {
      setProcessingId(null);
    }
  };

  if (forbidden) {
    return (
      <div className="min-h-screen bg-brand-gradient flex items-center justify-center px-4">
        <div className="text-center">
          <ShieldAlert size={40} className="mx-auto text-red-400 mb-4" />
          <p className="text-white font-semibold">Admin access required</p>
          <p className="text-sm text-slate-500 mt-1">
            Log in with an admin account to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gradient">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-white mb-1">
          Payment Verification Queue
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Cross-check each UTR against your UPI app / bank statement before
          approving.
        </p>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 size={28} className="animate-spin text-brand-accentLight" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <CheckCircle2 size={32} className="mx-auto text-brand-success mb-3" />
            <p className="text-slate-400 text-sm">
              No pending payments to verify. All caught up.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-brand-800 border border-brand-700 rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {order.course?.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {order.user?.name} &middot; {order.user?.email}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                      <span>
                        Amount:{" "}
                        <span className="text-slate-300 font-medium">
                          ₹{order.amount.toLocaleString("en-IN")}
                        </span>
                      </span>
                      <span>
                        UTR:{" "}
                        <span className="text-slate-300 font-mono">{order.utr}</span>
                      </span>
                      <span>Ref: {order.orderRef}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(order._id, "reject")}
                      disabled={processingId === order._id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                    <button
                      onClick={() => handleAction(order._id, "approve")}
                      disabled={processingId === order._id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-success/15 border border-brand-success/30 text-brand-success text-xs font-medium hover:bg-brand-success/25 transition-colors disabled:opacity-50"
                    >
                      {processingId === order._id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}
                      Approve
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
