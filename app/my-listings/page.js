"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiMapPin } from "react-icons/fi";
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
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">My Studio Listings</h1>

      {studios.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl sm:text-2xl font-bold">You have not listed any studio yet</h2>
          <p className="opacity-70 mt-2 mb-4">Add your first space and start receiving bookings.</p>
          <Link href="/add-studio" className="btn btn-primary">Add New Studio</Link>
        </div>
      ) : (
        <>
          {/* Tablet + desktop: table */}
          <div className="hidden md:block overflow-x-auto bg-base-100 rounded-box shadow-md">
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
                      <div className="flex items-center gap-3 min-w-48">
                        <img src={s.image} alt={s.title} className="w-16 h-12 rounded object-cover shrink-0" />
                        <span className="font-semibold">{s.title}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap">{s.category}</td>
                    <td className="whitespace-nowrap">${s.hourlyRate} / hr</td>
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

          {/* Phone: cards */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {studios.map((s) => (
              <div key={s._id} className="card bg-base-100 shadow-md">
                <figure className="h-44">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                </figure>
                <div className="card-body p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold text-lg break-words min-w-0">{s.title}</h2>
                    <span className="badge badge-primary shrink-0">{s.category}</span>
                  </div>
                  <p className="flex items-center gap-1 text-sm opacity-70">
                    <FiMapPin /> {s.location}
                  </p>
                  <p className="font-bold text-primary">${s.hourlyRate} / hr</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Link href={`/studios/edit/${s._id}`} className="btn btn-sm btn-primary">Update</Link>
                    <button onClick={() => setDeleteId(s._id)} className="btn btn-sm btn-error">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
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