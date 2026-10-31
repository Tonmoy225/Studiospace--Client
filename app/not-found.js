import Link from "next/link";
import { FiVideoOff } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[70vh] px-4">
      <div className="bg-primary/10 text-primary rounded-full p-8 mb-6">
        <FiVideoOff size={80} />
      </div>
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-bold mt-2">Cut! This scene is missing.</h2>
      <p className="opacity-70 mt-2 mb-6 max-w-md">
        The page you are looking for does not exist or has been moved to another set.
      </p>
      <Link href="/" className="btn btn-primary">Return to Home</Link>
    </div>
  );
}
