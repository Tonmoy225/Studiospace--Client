"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import PrivateRoute from "@/components/PrivateRoute";
import StudioForm from "@/components/StudioForm";

function AddStudio() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleAdd = async (data) => {
    setSaving(true);
    try {
      await api("/studios", { method: "POST", body: JSON.stringify(data) });
      toast.success("Studio added successfully!");
      router.push("/my-listings");
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Add New Studio</h1>
      <StudioForm onSubmit={handleAdd} submitLabel="Add Studio" saving={saving} />
    </div>
  );
}

export default function AddStudioPage() {
  return (
    <PrivateRoute>
      <AddStudio />
    </PrivateRoute>
  );
}
