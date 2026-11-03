"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // go back to the page the user wanted (only local paths allowed)
  const getRedirect = () => {
    const r = new URLSearchParams(window.location.search).get("redirect");
    return r && r.startsWith("/") ? r : "/";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.target);

    const { error: err } = await authClient.signIn.email({
      email: form.get("email"),
      password: form.get("password"),
    });

    if (err) {
      const msg = err.message || "Invalid email or password";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    await fetch("/api/jwt", { method: "POST" }); // JWT -> HTTPOnly cookie
    toast.success("Welcome back!");
    router.push(getRedirect());
  };

  const handleGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.origin + getRedirect(),
    });
  };

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <form onSubmit={handleLogin} className="card-body">
          <h1 className="text-3xl font-bold text-center">Login to StudioSpace</h1>

          <label className="label">Email</label>
          <input name="email" type="email" required placeholder="you@example.com" className="input input-bordered w-full" />

          <label className="label">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Your password"
              className="input input-bordered w-full pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lg opacity-70 hover:opacity-100"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button type="button" onClick={() => toast("Forgot password will be added soon")} className="text-sm text-primary text-left">
            Forgot Password?
          </button>

          {error && <p className="text-error text-sm">{error}</p>}

          <button className="btn btn-primary mt-2" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="divider">OR</div>

          <button type="button" onClick={handleGoogle} className="btn btn-outline">
            <FcGoogle size={22} /> Continue with Google
          </button>

          <p className="text-center mt-2">
            New to StudioSpace? <Link href="/register" className="text-primary font-semibold">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}