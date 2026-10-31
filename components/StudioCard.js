import Link from "next/link";
import { FiMapPin, FiStar } from "react-icons/fi";

export default function StudioCard({ studio }) {
  return (
    <div className="card bg-base-100 shadow-md h-full">
      <figure className="relative h-52">
        <img src={studio.image} alt={studio.title} className="w-full h-full object-cover" />
        <span className="badge badge-primary absolute top-3 left-3">{studio.category}</span>
        <span className="badge badge-warning absolute top-3 right-3 gap-1">
          <FiStar /> {studio.rating ? studio.rating.toFixed(1) : "New"}
        </span>
      </figure>
      <div className="card-body">
        <h3 className="card-title line-clamp-1">{studio.title}</h3>
        <p className="flex items-center gap-1 text-sm opacity-70">
          <FiMapPin /> {studio.location}
        </p>
        <p className="text-lg font-bold text-primary">${studio.hourlyRate} / hr</p>
        <div className="card-actions mt-auto">
          <Link href={`/studios/${studio._id}`} className="btn btn-primary w-full">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export function StudioSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="skeleton h-52 w-full"></div>
      <div className="skeleton h-5 w-3/4"></div>
      <div className="skeleton h-4 w-1/2"></div>
      <div className="skeleton h-10 w-full"></div>
    </div>
  );
}
