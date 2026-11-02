"use client";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "./WishlistProvider";

export default function WishlistButton({ studioId }) {
  const { ids, toggle } = useWishlist();
  const saved = ids.includes(studioId);

  return (
    <button
      onClick={() => toggle(studioId)}
      className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
    >
      {saved ? <FaHeart className="text-error" size={18} /> : <FiHeart size={18} />}
    </button>
  );
}