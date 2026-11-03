"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiMenu } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

const links = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    await fetch("/api/jwt", { method: "DELETE" }); // remove JWT cookie
    toast.success("Logged out successfully");
    router.push("/");
  };

  // "How It Works" is a section on the home page: smooth scroll to it
  const handleLinkClick = (e, href) => {
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      document.getElementById(href.slice(2))?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = links.map((l) => (
    <li key={l.label}>
      <Link
        href={l.href}
        onClick={(e) => handleLinkClick(e, l.href)}
        className={
          pathname === l.href
            ? "text-primary font-bold border-b-2 border-primary rounded-none"
            : ""
        }
      >
        {l.label}
      </Link>
    </li>
  ));

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-2 sm:px-4 lg:px-10 gap-1">
      {/* LEFT: hamburger (mobile) + logo */}
      <div className="navbar-start w-auto flex-1">
        <div className="dropdown">
          <div tabIndex={0} className="btn btn-ghost btn-sm px-2 lg:hidden">
            <FiMenu size={22} />
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            {navLinks}
            {/* only on very small phones (below 340px) Register moves into this menu */}
            {!user && !isPending && (
              <li className="min-[340px]:hidden">
                <Link href="/register">Register</Link>
              </li>
            )}
          </ul>
        </div>
        <Link href="/">
          <Logo />
        </Link>
      </div>

      {/* CENTER: links (desktop only) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1">{navLinks}</ul>
      </div>

      {/* RIGHT: theme toggle + auth */}
      <div className="navbar-end w-auto flex-1 gap-1 sm:gap-2">
        <ThemeToggle />
        {isPending ? (
          <span className="loading loading-spinner"></span>
        ) : user ? (
          <div className="dropdown dropdown-end dropdown-hover">
            <div tabIndex={0} className="avatar cursor-pointer">
              <div className="w-9 sm:w-10 rounded-full">
                <img
                  src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                />
              </div>
            </div>
            <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-10 w-56 p-2 shadow">
              <li className="px-3 py-2 font-bold">{user.name}</li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/add-studio">Add New Studio</Link></li>
              <li><Link href="/my-listings">My Studio Listings</Link></li>
              <li><Link href="/my-bookings">My Bookings</Link></li>
              <li><Link href="/wishlist">Saved Studios</Link></li>
              <li><button onClick={handleLogout} className="text-error">Logout</button></li>
            </ul>
          </div>
        ) : (
          <>
            <Link href="/login" className="btn btn-outline btn-primary btn-xs sm:btn-sm md:btn-md">Login</Link>
            <Link href="/register" className="btn btn-primary btn-xs sm:btn-sm md:btn-md hidden min-[340px]:inline-flex">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}