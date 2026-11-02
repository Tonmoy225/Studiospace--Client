"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

export default function BookingModal({ studio, onClose }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [booked, setBooked] = useState([]); // confirmed slots on the selected date
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const hours = startTime && endTime && toMin(endTime) > toMin(startTime)
    ? (toMin(endTime) - toMin(startTime)) / 60
    : 0;
  const total = hours * studio.hourlyRate;

  // Challenge 2: load confirmed bookings of this studio for the chosen date
  useEffect(() => {
    if (!date) {
      setBooked([]);
      return;
    }
    api(`/studios/${studio._id}/booked?date=${date}`)
      .then(setBooked)
      .catch(() => setBooked([]));
  }, [date, studio._id]);

  // instant warning (server still checks again before saving)
  const clash = hours > 0
    ? booked.find((b) => toMin(startTime) < toMin(b.endTime) && toMin(endTime) > toMin(b.startTime))
    : null;

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

        {date && booked.length > 0 && (
          <div className="alert alert-warning mt-3 text-sm block">
            <p className="font-semibold">Already booked on this date:</p>
            {booked.map((b, i) => (
              <p key={i}>{b.startTime} - {b.endTime}</p>
            ))}
          </div>
        )}

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

        {clash && (
          <p className="text-error text-sm mt-3">
            This time overlaps a confirmed booking ({clash.startTime} - {clash.endTime}). Please choose another time.
          </p>
        )}

        <div className="bg-base-200 rounded-lg p-3 mt-4">
          <p>Rate: ${studio.hourlyRate} / hr</p>
          <p>Hours: {+hours.toFixed(2)}</p>
          <p className="font-bold text-primary text-lg">Total: ${+total.toFixed(2)}</p>
          <p className="text-sm opacity-70">Security deposit: ${studio.securityDeposit}</p>
        </div>

        {error && <p className="text-error text-sm mt-3">{error}</p>}

        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>Close</button>
          <button className="btn btn-primary" disabled={loading || hours === 0 || !!clash}>
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}