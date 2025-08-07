import Link from "next/link";
import "./../styles/globals.css";

export const metadata = {
  title: "iFarmer Assignment",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="flex gap-4 p-4 bg-gray-100">
          <Link href="/assignment-1">Assignment-1</Link>
          <Link href="/assignment-2">Assignment-2</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
