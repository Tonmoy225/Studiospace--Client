"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import PrivateRoute from "@/components/PrivateRoute";
import Loader from "@/components/Loader";

const badge = {
  Pending: "badge-warning",
  Confirmed: "badge-success",
  Completed: "badge-info",
  Cancelled: "badge-error",
};

function Dashboard() {
  const { data: session } = authClient.useSession();
  const [studios, setStudios] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [a, b, c] = await Promise.all([
        api("/my-studios"),
        api("/my-bookings"),
        api("/host-bookings"),
      ]);
      setStudios(a);
      setMyBookings(b);
      setRequests(c);
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api(`/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      toast.success(`Booking marked as ${status}`);
      loadData();
    } catch (err) {
      toast.error(err.message); // shows double-booking error too
    }
  };

  if (loading) return <Loader />;

  const earnings = requests
    .filter((r) => r.status === "Confirmed" || r.status === "Completed")
    .reduce((sum, r) => sum + r.totalPrice, 0);

  const stats = [
    { label: "My Listings", value: studios.length },
    { label: "My Bookings", value: myBookings.length },
    { label: "Booking Requests", value: requests.length },
    { label: "Earnings", value: `$${earnings}` },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center">Dashboard</h1>
      <p className="text-center opacity-70 mt-2 mb-8">Welcome back, {session?.user?.name}</p>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card bg-base-100 shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-primary">{s.value}</p>
            <p className="opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4">Booking Requests on My Studios</h2>
      {requests.length === 0 ? (
        <p className="opacity-70">No booking requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Studio</th>
                <th>Guest</th>
                <th>Date & Time</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td>{r.studioTitle}</td>
                  <td>{r.userName}</td>
                  <td>{r.date} | {r.startTime} - {r.endTime}</td>
                  <td>${r.totalPrice}</td>
                  <td><span className={`badge ${badge[r.status]}`}>{r.status}</span></td>
                  <td>
                    <div className="flex gap-2">
                      {r.status === "Pending" && (
                        <>
                          <button onClick={() => updateStatus(r._id, "Confirmed")} className="btn btn-xs btn-success">Confirm</button>
                          <button onClick={() => updateStatus(r._id, "Cancelled")} className="btn btn-xs btn-error">Reject</button>
                        </>
                      )}
                      {r.status === "Confirmed" && (
                        <button onClick={() => updateStatus(r._id, "Completed")} className="btn btn-xs btn-info">Mark Completed</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  );
}
