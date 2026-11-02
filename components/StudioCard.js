import Link from "next/link";
import { FiMapPin } from "react-icons/fi";

export default function StudioCard({ studio }) {
  return (
    <div className="group card bg-base-100 border border-base-300 rounded-2xl shadow-md h-full overflow-hidden transition duration-200 hover:border-primary/60 hover:shadow-xl hover:-translate-y-1">
      <figure className="relative h-56 overflow-hidden">
        <img
          src={studio.image}
          alt={studio.title}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
        />
        {/* category pill (top left) */}
        <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {studio.category}
        </span>
        {/* rating pill (top right) */}
        <span className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-warning backdrop-blur-sm">
          {studio.rating ? studio.rating.toFixed(1) : "New"}
        </span>
      </figure>

      <div className="card-body p-5 gap-2">
        <p className="flex items-center gap-1.5 text-sm opacity-70">
          <FiMapPin /> {studio.location}
        </p>
        <h3 className="text-xl font-bold line-clamp-1">{studio.title}</h3>
        <p className="text-sm opacity-70 line-clamp-2 min-h-10">{studio.overview}</p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-base-300 pt-4">
          <p className="text-2xl font-bold text-primary">
            ${studio.hourlyRate}
            <span className="text-sm font-normal opacity-70"> / hr</span>
          </p>
          <Link href={`/studios/${studio._id}`} className="btn btn-primary rounded-full px-5">
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
      <div className="skeleton h-56 w-full rounded-2xl"></div>
      <div className="skeleton h-4 w-1/2"></div>
      <div className="skeleton h-6 w-3/4"></div>
      <div className="skeleton h-10 w-full"></div>
    </div>
  );
}