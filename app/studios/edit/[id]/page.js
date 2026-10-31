"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import PrivateRoute from "@/components/PrivateRoute";
import StudioForm from "@/components/StudioForm";
import Loader from "@/components/Loader";

function EditStudio() {
  const { id } = useParams();
  const router = useRouter();
  const [studio, setStudio] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api(`/studios/${id}`)
      .then(setStudio)
      .catch((e) => toast.error(e.message));
  }, [id]);

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      await api(`/studios/${id}`, { method: "PUT", body: JSON.stringify(data) });
      toast.success("Studio updated successfully!");
      router.push("/my-listings");
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  };

  if (!studio) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Update Studio</h1>
      <StudioForm initial={studio} onSubmit={handleUpdate} submitLabel="Update Studio" saving={saving} />
    </div>
  );
}

export default function EditStudioPage() {
  return (
    <PrivateRoute>
      <EditStudio />
    </PrivateRoute>
  );
}
