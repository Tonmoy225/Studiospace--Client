import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "StudioSpace | Book Creative Studios",
  description:
    "Discover and book photo studios, film stages, podcast lounges, music suites and art workshops.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
