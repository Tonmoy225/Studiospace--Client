"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

export default function BookingModal({ studio, onClose }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const hours = startTime && endTime && toMin(endTime) > toMin(startTime)
    ? (toMin(endTime) - toMin(startTime)) / 60
    : 0;
  const total = hours * studio.hourlyRate;

  const handleBook = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api("/bookings", {
        method: "POST",
        body: JSON.stringify({ studioId: studio._id, date, startTime, endTime }),
      });
      toast.success("Booking request sent! Status: Pending");
      router.push("/my-bookings");
    } catch (err) {
      setError(err.message); // e.g. double booking message from server
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <form onSubmit={handleBook} className="modal-box">
        <h3 className="font-bold text-xl">Book {studio.title}</h3>

        <label className="label mt-3">Date</label>
        <input type="date" min={today} required value={date} onChange={(e) => setDate(e.target.value)} className="input input-bordered w-full" />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label mt-3">Start Time</label>
            <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="input input-bordered w-full" />
          </div>
          <div>
            <label className="label mt-3">End Time</label>
            <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className="input input-bordered w-full" />
          </div>
        </div>

        <div className="bg-base-200 rounded-lg p-3 mt-4">
          <p>Rate: ${studio.hourlyRate} / hr</p>
          <p>Hours: {hours}</p>
          <p className="font-bold text-primary text-lg">Total: ${total}</p>
          <p className="text-sm opacity-70">Security deposit: ${studio.securityDeposit}</p>
        </div>

        {error && <p className="text-error text-sm mt-3">{error}</p>}

        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>Close</button>
          <button className="btn btn-primary" disabled={loading || hours === 0}>
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}
