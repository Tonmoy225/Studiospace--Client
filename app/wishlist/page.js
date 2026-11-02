"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import PrivateRoute from "@/components/PrivateRoute";
import StudioCard from "@/components/StudioCard";
import Loader from "@/components/Loader";
import { useWishlist } from "@/components/WishlistProvider";

function Saved() {
  const { ids, loaded } = useWishlist();
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/wishlist")
      .then(setStudios)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !loaded) return <Loader />;

  // when you un-heart a card it disappears from this page
  const visible = studios.filter((s) => ids.includes(s._id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">Saved Studios</h1>
      {visible.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl sm:text-2xl font-bold">No saved studios yet</h2>
          <p className="opacity-70 mt-2 mb-4">Tap the heart on any studio card to save it here.</p>
          <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((s) => <StudioCard key={s._id} studio={s} />)}
        </div>
      )}
    </div>
  );
}

export default function SavedStudiosPage() {
  return (
    <PrivateRoute>
      <Saved />
    </PrivateRoute>
  );
}