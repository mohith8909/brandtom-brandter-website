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
  title: "Brandtom & Brandter | Vision to Impact",
  description: "Moving your vision from a thought to an impact. A full-service marketing and branding agency.",
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
