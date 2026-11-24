import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/Motion/SmoothScroll";
import Cursor from "@/components/Motion/Cursor";
import Preloader from "@/components/Motion/Preloader";

// DM Sans is bundled with the site (SIL Open Font License, see app/fonts) rather than
// fetched from Google at build time, so builds are identical locally and on Vercel.
const dmSans = localFont({
  src: "./fonts/DMSans-latin-variable.woff2",
  weight: "100 1000",
  style: "normal",
  display: "swap",
  variable: "--font-dm-sans",
  fallback: ["system-ui", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
});


export const metadata = {
  title: "Brandtom & Brandter | Marketing Solutions Agency",
  description: "Brandtom & Brandter specialises in full-spectrum marketing solutions, turning ideas into impact from concept to execution. We blend strategy, creativity, and psychology to build brands that connect, convert, and endure.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <noscript>
          <style>{`.sr-word{transform:none!important;opacity:1!important}.img-reveal{clip-path:none!important}`}</style>
        </noscript>
        <Preloader />
        <SmoothScroll />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
