"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/analytics", label: "Analytics" },
    { href: "/products", label: "Products" },
    { href: "/policy-ai", label: "Policy AI" },
    { href: "/support-ai", label: "Support AI" },
    { href: "/visual-search", label: "Visual Search" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r p-6">
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`p-2 rounded ${
              pathname === link.href ? "bg-blue-600 text-white" : "hover:bg-blue-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}