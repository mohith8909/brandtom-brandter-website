import { DM_Sans, Oswald } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700']
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: '--font-oswald',
  weight: ['400', '500', '600', '700']
});

export const metadata = {
  title: "Brandtom & Brandter | Marketing Solutions Agency",
  description: "Brandtom & Brandter specialises in full-spectrum marketing solutions, turning ideas into impact from concept to execution. We blend strategy, creativity, and psychology to build brands that connect, convert, and endure.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${oswald.variable}`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
