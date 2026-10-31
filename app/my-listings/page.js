"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import PrivateRoute from "@/components/PrivateRoute";
import ConfirmModal from "@/components/ConfirmModal";
import Loader from "@/components/Loader";

function MyListings() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api("/my-studios")
      .then(setStudios)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api(`/studios/${deleteId}`, { method: "DELETE" });
      setStudios((prev) => prev.filter((s) => s._id !== deleteId));
      toast.success("Studio deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
    setDeleting(false);
    setDeleteId(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">My Studio Listings</h1>

      {studios.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold">You have not listed any studio yet</h2>
          <p className="opacity-70 mt-2 mb-4">Add your first space and start receiving bookings.</p>
          <Link href="/add-studio" className="btn btn-primary">Add New Studio</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Studio</th>
                <th>Category</th>
                <th>Rate</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studios.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={s.image} alt={s.title} className="w-16 h-12 rounded object-cover" />
                      <span className="font-semibold">{s.title}</span>
                    </div>
                  </td>
                  <td>{s.category}</td>
                  <td>${s.hourlyRate} / hr</td>
                  <td>{s.location}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link href={`/studios/edit/${s._id}`} className="btn btn-sm btn-primary">Update</Link>
                      <button onClick={() => setDeleteId(s._id)} className="btn btn-sm btn-error">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete this studio?"
        message="This will permanently remove the listing. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <PrivateRoute>
      <MyListings />
    </PrivateRoute>
  );
}
