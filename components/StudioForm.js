"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { CATEGORIES, AMENITIES } from "@/lib/constants";

// Used by both Add Studio and Update Studio pages
export default function StudioForm({ initial = {}, onSubmit, submitLabel, saving }) {
  const { data: session } = authClient.useSession();
  const [amenities, setAmenities] = useState(initial.amenities || []);

  const toggleAmenity = (a) => {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    onSubmit({
      title: f.get("title"),
      category: f.get("category"),
      hourlyRate: f.get("hourlyRate"),
      securityDeposit: f.get("securityDeposit"),
      capacity: f.get("capacity"),
      location: f.get("location"),
      image: f.get("image"),
      gallery: f.get("gallery").split(",").map((s) => s.trim()).filter(Boolean),
      amenities,
      overview: f.get("overview"),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="label">Studio Title</label>
        <input name="title" required defaultValue={initial.title} placeholder="e.g. Aperture Cyc Wall Studio" className="input input-bordered w-full" />
      </div>

      <div>
        <label className="label">Category</label>
        <select name="category" required defaultValue={initial.category || ""} className="select select-bordered w-full">
          <option value="" disabled>Select category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="label">Location / Address</label>
        <input name="location" required defaultValue={initial.location} placeholder="Area, City" className="input input-bordered w-full" />
      </div>

      <div>
        <label className="label">Hourly Rate ($)</label>
        <input name="hourlyRate" type="number" min="1" required defaultValue={initial.hourlyRate} className="input input-bordered w-full" />
      </div>

      <div>
        <label className="label">Security Deposit ($)</label>
        <input name="securityDeposit" type="number" min="0" required defaultValue={initial.securityDeposit} className="input input-bordered w-full" />
      </div>

      <div>
        <label className="label">Max Capacity</label>
        <input name="capacity" type="number" min="1" required defaultValue={initial.capacity} className="input input-bordered w-full" />
      </div>

      <div>
        <label className="label">Main Image URL (imgbb / postimage)</label>
        <input name="image" type="url" required defaultValue={initial.image} placeholder="https://i.ibb.co/..." className="input input-bordered w-full" />
      </div>

      <div className="md:col-span-2">
        <label className="label">Gallery Image URLs (optional, comma separated)</label>
        <input name="gallery" defaultValue={(initial.gallery || []).join(", ")} placeholder="https://..., https://..." className="input input-bordered w-full" />
      </div>

      <div className="md:col-span-2">
        <label className="label">Amenities</label>
        <div className="flex flex-wrap gap-4">
          {AMENITIES.map((a) => (
            <label key={a} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} className="checkbox checkbox-primary checkbox-sm" />
              {a}
            </label>
          ))}
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="label">Detailed Overview</label>
        <textarea name="overview" required rows={5} defaultValue={initial.overview} placeholder="Describe the space, equipment and rules" className="textarea textarea-bordered w-full"></textarea>
      </div>

      <div>
        <label className="label">Host Name</label>
        <input value={session?.user?.name || ""} readOnly className="input input-bordered w-full bg-base-200" />
      </div>
      <div>
        <label className="label">Host Email</label>
        <input value={session?.user?.email || ""} readOnly className="input input-bordered w-full bg-base-200" />
      </div>

      <div className="md:col-span-2">
        <button className="btn btn-primary w-full" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
