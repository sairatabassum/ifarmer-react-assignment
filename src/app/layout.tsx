// app/layout.tsx
import "./../styles/globals.css";
import Navbar from "../components/layout/Navbar";
import { Inter } from "next/font/google";

export const metadata = {
  title: "iFarmer Assignment",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}