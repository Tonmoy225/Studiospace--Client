"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

const validatePassword = (p) => {
  if (p.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(p)) return "Password must have an uppercase letter";
  if (!/[a-z]/.test(p)) return "Password must have a lowercase letter";
  return "";
};

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    const form = new FormData(e.target);

    const passError = validatePassword(form.get("password"));
    if (passError) {
      setError(passError);
      toast.error(passError);
      return;
    }

    setLoading(true);
    const { error: err } = await authClient.signUp.email({
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      image: form.get("photo"),
    });

    if (err) {
      const msg = err.message || "Registration failed";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    toast.success("Account created! Please login.");
    router.push("/login");
  };

  const handleGoogle = async () => {
    await authClient.signIn.social({ provider: "google", callbackURL: window.location.origin });
  };

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <form onSubmit={handleRegister} className="card-body">
          <h1 className="text-3xl font-bold text-center">Create Your Account</h1>

          <label className="label">Name</label>
          <input name="name" type="text" required placeholder="Your full name" className="input input-bordered w-full" />

          <label className="label">Email</label>
          <input name="email" type="email" required placeholder="you@example.com" className="input input-bordered w-full" />

          <label className="label">Photo URL</label>
          <input name="photo" type="url" placeholder="https://..." className="input input-bordered w-full" />

          <label className="label">Password</label>
          <input name="password" type="password" required placeholder="Min 6 chars, upper + lower case" className="input input-bordered w-full" />

          {error && <p className="text-error text-sm">{error}</p>}

          <button className="btn btn-primary mt-2" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>

          <div className="divider">OR</div>

          <button type="button" onClick={handleGoogle} className="btn btn-outline">
            <FcGoogle size={22} /> Continue with Google
          </button>

          <p className="text-center mt-2">
            Already have an account? <Link href="/login" className="text-primary font-semibold">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
