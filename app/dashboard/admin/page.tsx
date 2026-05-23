"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAppStore";
import { adminApi } from "@/lib/api";
import { ShieldAlert, Users, TrendingUp, Activity, Check, X } from "lucide-react";
import type { AdminStats, User } from "@/types";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !user.is_superuser) {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminApi.getStats(),
          adminApi.getUsers({ limit: 50 })
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Failed to load admin data", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.is_superuser) {
      fetchAdminData();
    }
  }, [user]);

  if (!user?.is_superuser) return null;

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <ShieldAlert className="text-red-500" /> Admin Dashboard
        </h1>
        <p className="text-slate-400">
          Platform usage metrics and user management.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats */}
          {stats && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6 border-red-500/10">
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <Users size={18} /> <span className="font-semibold">Total Users</span>
                </div>
                <div className="text-3xl font-display font-bold text-white">{stats.total_users}</div>
              </div>
              <div className="card p-6 border-red-500/10">
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <TrendingUp size={18} /> <span className="font-semibold">Premium Conversions</span>
                </div>
                <div className="text-3xl font-display font-bold text-white">{stats.premium_users}</div>
              </div>
              <div className="card p-6 border-red-500/10">
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <Activity size={18} /> <span className="font-semibold">Resumes Analyzed</span>
                </div>
                <div className="text-3xl font-display font-bold text-white">{stats.total_analyses}</div>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Recent Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-900 border-b border-white/5">
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Plan</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Active</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-white">{u.full_name || "Unknown"}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          u.plan === "premium" ? "bg-brand-500/20 text-brand-400 border border-brand-500/30" : "bg-surface-800 text-slate-400"
                        }`}>
                          {u.plan}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.is_active ? <Check size={16} className="text-emerald-500" /> : <X size={16} className="text-red-500" />}
                      </td>
                      <td className="p-4 text-sm text-slate-300">
                        {u.is_superuser ? <span className="text-red-400 font-semibold">Admin</span> : "User"}
                      </td>
                      <td className="p-4 text-sm text-slate-400">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
