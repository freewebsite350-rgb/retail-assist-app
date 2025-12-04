"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart, Box, Bot } from "lucide-react";

const menu = [
    { name: "Analytics", icon: <BarChart size={18} />, path: "/dashboard/analytics" },
    { name: "Products", icon: <Box size={18} />, path: "/dashboard/products" },
    { name: "AI Assistants", icon: <Bot size={18} />, path: "/dashboard/ai" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-white dark:bg-zinc-900 shadow-lg p-4">
            <h2 className="text-xl font-bold mb-6">Dashboard</h2>

            <nav className="space-y-2">
                {menu.map((item) => (
                    <Link key={item.path} href={item.path}>
                        <div
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer
                              ${pathname === item.path
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
                                }`}
                        >
                            {item.icon}
                            {item.name}
                        </div>
                    </Link>
                ))}
            </nav>
        </div>
    );
}