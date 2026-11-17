"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
}

export function Sidebar({ items, title }: { items: NavItem[]; title: string }) {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-white border-r">
      <div className="px-6 py-5 border-b">
        <span className="text-lg font-bold text-brand">🏓 {title}</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ href, label, Icon }) => (
          <Link key={href} href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition",
              pathname.startsWith(href)
                ? "bg-brand-light text-brand"
                : "text-gray-600 hover:bg-gray-100"
            )}>
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="px-3 py-4 border-t">
        <button onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50 transition">
          Sign Out
        </button>
      </div>
    </aside>
  );
}
