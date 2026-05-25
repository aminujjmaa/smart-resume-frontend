/* eslint-disable */
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Upload, BarChart2, History,
  CreditCard, LogOut, Zap, ChevronRight, User, FileText,
  Share2, Mail, BookOpen, Target, Network, MessageSquare, ShieldAlert
} from "lucide-react";
import { useAuthStore } from "@/store/useAppStore";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard",           icon: LayoutDashboard, label: "Overview" },
  { href: "/scan",              icon: Upload,          label: "Upload Resume" },
  { href: "/dashboard/templates", icon: FileText,        label: "Templates" },
  { href: "/dashboard/linkedin",  icon: Share2,          label: "LinkedIn Review" },
  { href: "/dashboard/cover-letter", icon: Mail,         label: "Cover Letter" },
  { href: "/dashboard/networking", icon: Network,        label: "Networking Emails" },
  { href: "/dashboard/interview-prep", icon: MessageSquare, label: "Interview Prep" },
  { href: "/action-verbs",        icon: BookOpen,        label: "Action Verbs" },
  { href: "/dashboard/skills",    icon: Target,          label: "Skills Matrix" },
  { href: "/dashboard/history",   icon: History,         label: "History" },
  { href: "/dashboard/billing",   icon: CreditCard,      label: "Billing" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen flex flex-col border-r border-brand-500/10 bg-surface-900">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-brand-500/10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
          <Zap size={15} className="text-white" />
        </div>
        <span className="font-display font-bold text-white">SmartResume <span className="gradient-text">AI</span></span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <motion.div key={href} whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Link
                href={href}
                id={`sidebar-${label.toLowerCase().replace(/\s+/g, "-")}`}
                className={`sidebar-item ${active ? "active" : ""}`}
              >
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={14} className="text-brand-400" />}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Admin Nav */}
      {user?.is_superuser && (
        <div className="px-4 py-2 border-t border-brand-500/10 pt-4">
          <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Link
              href="/dashboard/admin"
              className={`sidebar-item ${pathname === "/dashboard/admin" ? "active bg-red-500/10 text-red-400" : "text-red-400/70 hover:text-red-400 hover:bg-red-500/10"}`}
            >
              <ShieldAlert size={18} />
              <span className="flex-1">Admin Panel</span>
            </Link>
          </motion.div>
        </div>
      )}

      {/* User + Logout */}
      <div className="p-4 border-t border-brand-500/10 space-y-2">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || <User size={14} />}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-medium truncate">{user?.full_name || "User"}</p>
            <p className="text-slate-500 text-xs truncate">{user?.plan === "premium" ? "⚡ Pro" : "Free Plan"}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
          id="sidebar-logout"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
