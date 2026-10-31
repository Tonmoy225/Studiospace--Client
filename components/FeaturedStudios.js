"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import StudioCard, { StudioSkeleton } from "./StudioCard";

export default function FeaturedStudios() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // top rated, only 6 -> server uses .limit(6)
    api("/studios?sort=rating&limit=6")
      .then(setStudios)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <h2 className="text-3xl font-bold text-center">Featured Studios</h2>
      <p className="text-center opacity-70 mt-2 mb-8">Top rated creative spaces loved by our community</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [1, 2, 3, 4, 5, 6].map((n) => <StudioSkeleton key={n} />)
          : studios.map((s) => <StudioCard key={s._id} studio={s} />)}
      </div>

      {!loading && studios.length === 0 && (
        <p className="text-center opacity-70">No studios listed yet. Be the first host!</p>
      )}

      <div className="text-center mt-8">
        <Link href="/studios" className="btn btn-outline btn-primary">See All Studios</Link>
      </div>
    </section>
  );
}
