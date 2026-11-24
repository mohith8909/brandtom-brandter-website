import { DM_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/Motion/SmoothScroll";
import Cursor from "@/components/Motion/Cursor";
import Preloader from "@/components/Motion/Preloader";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700']
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
