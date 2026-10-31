"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiAperture, FiInstagram, FiFacebook, FiYoutube } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { CATEGORIES } from "@/lib/constants";

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Thanks for subscribing!");
    e.target.reset();
  };

  return (
    <footer className="bg-base-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <FiAperture size={28} /> StudioSpace
          </Link>
          <p className="mt-3 opacity-70">
            Our mission is to make every creative space easy to find, fair to book and ready to shoot.
          </p>
          <div className="flex gap-3 mt-4 text-xl">
            <a href="https://x.com" target="_blank"><FaXTwitter /></a>
            <a href="https://instagram.com" target="_blank"><FiInstagram /></a>
            <a href="https://facebook.com" target="_blank"><FiFacebook /></a>
            <a href="https://youtube.com" target="_blank"><FiYoutube /></a>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 opacity-80">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/studios">Explore Studios</Link></li>
            <li><Link href="/#how-it-works">How It Works</Link></li>
            <li><Link href="/about">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3">Popular Categories</h3>
          <ul className="space-y-2 opacity-80">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link href={`/studios?category=${encodeURIComponent(c)}`}>{c}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3">Newsletter</h3>
          <p className="opacity-70 mb-3">Get new studio listings in your inbox.</p>
          <form onSubmit={handleSubscribe} className="join w-full">
            <input type="email" required placeholder="Your email" className="input input-bordered join-item w-full" />
            <button className="btn btn-primary join-item">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-base-300 text-center py-4 text-sm opacity-70">
        © 2026 StudioSpace. All rights reserved. | Terms of Service | Privacy Policy
      </div>
    </footer>
  );
}
