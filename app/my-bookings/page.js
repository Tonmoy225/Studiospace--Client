"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import PrivateRoute from "@/components/PrivateRoute";
import ConfirmModal from "@/components/ConfirmModal";
import Loader from "@/components/Loader";

const badge = {
  Pending: "badge-warning",
  Confirmed: "badge-success",
  Completed: "badge-info",
  Cancelled: "badge-error",
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    api("/my-bookings")
      .then(setBookings)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api(`/bookings/${cancelId}/cancel`, { method: "PATCH" });
      setBookings((prev) => prev.map((b) => (b._id === cancelId ? { ...b, status: "Cancelled" } : b)));
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(err.message);
    }
    setCancelling(false);
    setCancelId(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold">No bookings yet</h2>
          <p className="opacity-70 mt-2 mb-4">Find a studio and make your first reservation.</p>
          <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <div key={b._id} className="card md:card-side bg-base-100 shadow-md">
              <figure className="md:w-56 h-40 md:h-auto">
                <img src={b.studioImage} alt={b.studioTitle} className="w-full h-full object-cover" />
              </figure>
              <div className="card-body">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="card-title">{b.studioTitle}</h2>
                  <span className={`badge ${badge[b.status]}`}>{b.status}</span>
                </div>
                <p className="opacity-70">{b.location}</p>
                <p>{b.date} | {b.startTime} - {b.endTime} ({b.hours} hrs)</p>
                <p className="font-bold text-primary">Total: ${b.totalPrice}</p>
                {b.status === "Pending" && (
                  <div className="card-actions justify-end">
                    <button onClick={() => setCancelId(b._id)} className="btn btn-sm btn-error">Cancel Booking</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!cancelId}
        title="Cancel this booking?"
        message="Your pending booking request will be cancelled."
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
        loading={cancelling}
      />
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <PrivateRoute>
      <MyBookings />
    </PrivateRoute>
  );
}
