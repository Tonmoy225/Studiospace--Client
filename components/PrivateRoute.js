"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Loader from "./Loader";

// Wrap any private page with this.
// While session is loading (isPending) we show a loader -> reload never kicks you to /login.
export default function PrivateRoute({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [isPending, session, router, pathname]);

  if (isPending || !session) return <Loader />;
  return children;
}
