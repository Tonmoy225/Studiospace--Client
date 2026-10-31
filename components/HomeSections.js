"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  FiCamera, FiFilm, FiMic, FiMusic, FiEdit3,
  FiSearch, FiClock, FiCheckCircle, FiVideo,
  FiShield, FiUserCheck, FiTool, FiHeadphones,
} from "react-icons/fi";
import { CATEGORIES } from "@/lib/constants";

// TODO: replace these image links with your own (Unsplash / imgbb)
const slides = [
  {
    image: "https://picsum.photos/seed/hero1/1600/800",
    title: "Find the Perfect Studio for Your Next Shoot",
    text: "Photo studios, film stages and more, available by the hour.",
  },
  {
    image: "https://picsum.photos/seed/hero2/1600/800",
    title: "Record Your Sound in a Pro Space",
    text: "Podcast lounges and music suites with studio-grade gear.",
  },
  {
    image: "https://picsum.photos/seed/hero3/1600/800",
    title: "Turn Your Empty Space into Income",
    text: "List your studio and let creators book it instantly.",
  },
];

export function HeroSlider() {
  return (
    <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4000 }} pagination={{ clickable: true }} loop>
      {slides.map((s) => (
        <SwiperSlide key={s.title}>
          <div className="relative h-[70vh] min-h-[420px]">
            <img src={s.image} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
              <h1 className="text-3xl md:text-5xl font-bold max-w-3xl">{s.title}</h1>
              <p className="mt-4 text-lg max-w-xl">{s.text}</p>
              <div className="flex gap-3 mt-6">
                {/* assignment says both buttons link to /studios */}
                <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
                <Link href="/studios" className="btn btn-outline text-white">Host Your Space</Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

const icons = {
  "Photo Studio": FiCamera,
  "Film Stage": FiFilm,
  "Podcast Lounge": FiMic,
  "Music Suite": FiMusic,
  Workshop: FiEdit3,
};

export function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <h2 className="text-3xl font-bold text-center">Browse by Studio Categories</h2>
      <p className="text-center opacity-70 mt-2 mb-8">Pick the kind of space your project needs</p>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((c) => {
          const Icon = icons[c];
          return (
            <Link
              key={c}
              href={`/studios?category=${encodeURIComponent(c)}`}
              className="card bg-base-100 shadow-md hover:shadow-xl items-center text-center p-6 h-full"
            >
              <Icon size={36} className="text-primary mb-3" />
              <h3 className="font-bold">{c}</h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const steps = [
  { icon: FiSearch, title: "1. Discover Spaces", text: "Browse and filter studios by category, price and location." },
  { icon: FiClock, title: "2. Select Shoot Hours", text: "Choose your date and the exact hours you need." },
  { icon: FiCheckCircle, title: "3. Book Instantly", text: "Send your booking and track its status in My Bookings." },
  { icon: FiVideo, title: "4. Create & Produce", text: "Show up, set up and focus on making great work." },
];

export function HowBookingWorks() {
  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-4 mt-16">
      <h2 className="text-3xl font-bold text-center">How Booking Works</h2>
      <p className="text-center opacity-70 mt-2 mb-8">From search to shoot in four simple steps</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.title} className="card bg-base-100 shadow-md p-6 text-center items-center h-full">
            <div className="bg-primary/10 text-primary rounded-full p-4 mb-3">
              <s.icon size={28} />
            </div>
            <h3 className="font-bold text-lg">{s.title}</h3>
            <p className="opacity-70 mt-1">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const guarantees = [
  { icon: FiShield, title: "Liability Protection", text: "Every booking is covered by our host and guest protection policy." },
  { icon: FiUserCheck, title: "Verified Profiles", text: "Hosts and creators are verified before they can list or book." },
  { icon: FiTool, title: "Equipment Safety", text: "Gear and studio setups are checked against our safety checklist." },
  { icon: FiHeadphones, title: "24/7 Host Support", text: "Our support team is always available if something goes wrong." },
];

export function HostGuarantee() {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">
      <h2 className="text-3xl font-bold text-center">Host Guarantee & Creator Support</h2>
      <p className="text-center opacity-70 mt-2 mb-8">Book and host with confidence</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {guarantees.map((g) => (
          <div key={g.title} className="card bg-base-200 p-6 h-full">
            <g.icon size={30} className="text-primary mb-3" />
            <h3 className="font-bold text-lg">{g.title}</h3>
            <p className="opacity-70 mt-1">{g.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
