"use client";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

const WishlistContext = createContext({ ids: [], loaded: false, toggle: () => {} });
export const useWishlist = () => useContext(WishlistContext);

// Keeps the list of saved studio ids so every heart icon knows if it is filled
export default function WishlistProvider({ children }) {
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;
  const [ids, setIds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!email) {
      setIds([]);
      setLoaded(false);
      return;
    }
    api("/wishlist/ids")
      .then(setIds)
      .catch(() => setIds([]))
      .finally(() => setLoaded(true));
  }, [email]);

  const toggle = async (studioId) => {
    if (!email) {
      toast.error("Please login to save studios");
      return;
    }
    const saved = ids.includes(studioId);
    try {
      await api(`/wishlist/${studioId}`, { method: saved ? "DELETE" : "POST" });
      setIds(saved ? ids.filter((i) => i !== studioId) : [...ids, studioId]);
      toast.success(saved ? "Removed from saved studios" : "Saved to your wishlist");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return <WishlistContext.Provider value={{ ids, loaded, toggle }}>{children}</WishlistContext.Provider>;
}