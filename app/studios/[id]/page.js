"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import toast from "react-hot-toast";
import { FiMapPin, FiStar, FiUsers } from "react-icons/fi";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import Loader from "@/components/Loader";
import BookingModal from "@/components/BookingModal";

export default function StudioDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api(`/studios/${id}`)
      .then(setStudio)
      .catch(() => setStudio(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookClick = () => {
    if (!session) {
      toast.error("Please login to book a studio");
      router.push(`/login?redirect=/studios/${id}`);
      return;
    }
    setShowModal(true);
  };

  if (loading) return <Loader />;
  if (!studio) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Studio not found</h2>
        <Link href="/studios" className="btn btn-primary">Back to Studios</Link>
      </div>
    );
  }

  const images = [studio.image, ...(studio.gallery || [])];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="rounded-xl">
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <img src={img} alt={studio.title} className="w-full h-72 md:h-96 object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex flex-wrap items-center gap-2 mt-6">
            <span className="badge badge-primary">{studio.category}</span>
            <span className="badge badge-warning gap-1"><FiStar /> {studio.rating ? studio.rating.toFixed(1) : "New"}</span>
          </div>
          <h1 className="text-3xl font-bold mt-3">{studio.title}</h1>
          <p className="flex items-center gap-2 opacity-70 mt-2"><FiMapPin /> {studio.location}</p>
          <p className="flex items-center gap-2 opacity-70 mt-1"><FiUsers /> Max capacity: {studio.capacity} people</p>

          <h2 className="text-xl font-bold mt-8 mb-2">Overview</h2>
          <p className="opacity-80">{studio.overview}</p>

          <h2 className="text-xl font-bold mt-8 mb-2">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {(studio.amenities || []).map((a) => (
              <span key={a} className="badge badge-outline">{a}</span>
            ))}
          </div>

          <h2 className="text-xl font-bold mt-8 mb-3">Reviews</h2>
          {studio.reviews?.length ? (
            <div className="space-y-3">
              {studio.reviews.map((r, i) => (
                <div key={i} className="bg-base-200 rounded-lg p-4">
                  <p className="font-semibold">{r.name} <span className="text-warning ml-2">{"★".repeat(r.rating)}</span></p>
                  <p className="opacity-80 mt-1">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="opacity-70">No reviews yet for this studio.</p>
          )}
        </div>

        <div>
          <div className="card bg-base-100 shadow-lg p-6 sticky top-24">
            <p className="text-3xl font-bold text-primary">${studio.hourlyRate} <span className="text-base font-normal opacity-70">/ hr</span></p>
            <p className="opacity-70 mt-1">Security deposit: ${studio.securityDeposit}</p>
            <button onClick={handleBookClick} className="btn btn-primary w-full mt-4">Book Workspace Now</button>

            <div className="divider"></div>
            <h3 className="font-bold">Hosted by</h3>
            <p className="mt-1">{studio.ownerName}</p>
            <p className="text-sm opacity-70">{studio.ownerEmail}</p>
          </div>
        </div>
      </div>

      {showModal && <BookingModal studio={studio} onClose={() => setShowModal(false)} />}
    </div>
  );
}
