"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import StudioCard, { StudioSkeleton } from "@/components/StudioCard";
import Loader from "@/components/Loader";

function StudiosContent() {
  const params = useSearchParams();
  const [category, setCategory] = useState(params.get("category") || "All");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const q = new URLSearchParams({ category, sort, search }).toString();
      api(`/studios?${q}`)
        .then(setStudios)
        .catch((e) => toast.error(e.message))
        .finally(() => setLoading(false));
    }, 300); // wait a little while user is typing
    return () => clearTimeout(timer);
  }, [category, sort, search]);

  const clearFilters = () => {
    setCategory("All");
    setSort("newest");
    setSearch("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center">Explore Studios</h1>
      <p className="text-center opacity-70 mt-2 mb-8">Find the right space for your next project</p>

      <div className="grid gap-3 md:grid-cols-3 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or location"
          className="input input-bordered w-full"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="select select-bordered w-full">
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="select select-bordered w-full">
          <option value="newest">Newest</option>
          <option value="rating">Top Rated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => <StudioSkeleton key={n} />)}
        </div>
      ) : studios.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold">No studios found</h2>
          <p className="opacity-70 mt-2 mb-4">Try a different search or category.</p>
          <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((s) => <StudioCard key={s._id} studio={s} />)}
        </div>
      )}
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={<Loader />}>
      <StudiosContent />
    </Suspense>
  );
}
