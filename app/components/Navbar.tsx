"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path
      ? "text-green-400 font-semibold"
      : "text-gray-300 hover:text-white";

  return (
    <nav className="w-full bg-[#0a0f1a] border-b border-[#1c263f] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link href="/dashboard" className="text-green-400 text-xl font-bold">
        AutoBudget
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-6 text-sm">
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>

        <Link href="/expenses" className="px-3 py-1 rounded-lg bg-green-500 text-black">
          Add Expense
        </Link>

        <Link href="/analysis/weekly" className={linkClass("/analysis/weekly")}>
          Weekly
        </Link>

        <Link href="/analysis/monthly" className={linkClass("/analysis/monthly")}>
          Monthly
        </Link>
      </div>
    </nav>
  );
}
