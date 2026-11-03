"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { imageToDataUrl } from "@/lib/imageToDataUrl";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB (before resizing)

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
  const [preview, setPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return setPreview("");
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      e.target.value = "";
      return setPreview("");
    }
    if (file.size > MAX_SIZE) {
      toast.error("Image must be under 5MB");
      e.target.value = "";
      return setPreview("");
    }
    setPreview(URL.createObjectURL(file));
  };

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

    // 1) convert the photo (optional) to a small base64 string
    let imageData = "";
    const file = form.get("photo");
    if (file && file.size > 0) {
      try {
        imageData = await imageToDataUrl(file);
      } catch (imgErr) {
        setError(imgErr.message);
        toast.error(imgErr.message);
        setLoading(false);
        return;
      }
    }

    // 2) register -> Better Auth saves this string in MongoDB (user.image)
    const { error: err } = await authClient.signUp.email({
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      image: imageData,
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

          <label className="label">Upload Photo</label>
          <input
            name="photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="w-20 h-20 rounded-full object-cover mt-1" />
          )}

          <label className="label">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Min 6 chars, upper + lower case"
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