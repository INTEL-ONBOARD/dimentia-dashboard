"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import DataTable from "@/components/tables/DataTable";
import BasePieChart from "@/components/charts/BasePieChart";
import BaseBarChart from "@/components/charts/BaseBarChart";
import MetricCard from "@/components/cards/MetricCard";
import { useUsers, useDemographics } from "@/hooks/useApi";
import type { UsersResponse, Demographics } from "@/lib/types";
import { useState } from "react";
import { Users, UserPlus, UserCheck, Activity } from "lucide-react";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data: usersData, isLoading: usersLoading } = useUsers({ page, limit: 20, search }) as { data: UsersResponse | undefined; isLoading: boolean };
  const { data: demographics, isLoading: demographicsLoading } = useDemographics() as { data: Demographics | undefined; isLoading: boolean };

  const userColumns = [
    { key: "id", label: "ID", sortable: true },
    { key: "fullName", label: "Full Name", sortable: true },
    { key: "age", label: "Age", sortable: true },
    { key: "gender", label: "Gender", sortable: true },
    {
      key: "role", label: "Role", sortable: true,
      render: (value: string) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${value === 'Patient'
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
          : 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
          }`}>
          {value}
        </span>
      )
    },
    { key: "registeredDate", label: "Registered", sortable: true },
    { key: "lastActive", label: "Last Active", sortable: true },
    { key: "totalSessions", label: "Sessions", sortable: true },
    { key: "totalPoints", label: "Points", sortable: true },
    {
      key: "status", label: "Status", sortable: true,
      render: (value: string) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${value === 'Active'
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
          }`}>
          {value}
        </span>
      )
    },
  ];

  const totalUsers = usersData?.total ?? 0;
  const activeUsers = usersData?.users?.filter((u: any) => u.status === 'Active').length ?? 0;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-60 flex-1 py-6 px-8">
        <TopNav title="User Analytics" subtitle="Manage and analyze user data" />

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <MetricCard
            label="Total Users"
            value={totalUsers}
            change={12.5}
            icon={Users}
            color="indigo"
            loading={usersLoading}
          />
          <MetricCard
            label="Active Users"
            value={activeUsers}
            change={8.2}
            icon={UserCheck}
            color="emerald"
            loading={usersLoading}
          />
          <MetricCard
            label="New This Month"
            value={127}
            change={23.1}
            icon={UserPlus}
            color="purple"
            loading={usersLoading}
          />
          <MetricCard
            label="Avg. Sessions/User"
            value={45}
            change={5.7}
            icon={Activity}
            color="amber"
            loading={usersLoading}
          />
        </div>

        {/* Demographics Charts */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              User Demographics
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Based on {totalUsers} registered users
            </span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <BasePieChart
              title="Users by Role"
              data={demographics?.byRole ?? []}
              loading={demographicsLoading}
            />
            <BasePieChart
              title="Users by Gender"
              data={demographics?.byGender ?? []}
              loading={demographicsLoading}
            />
            <BaseBarChart
              title="Users by Age Group"
              data={demographics?.byAge ?? []}
              dataKeys={[{ key: "count", color: "#6366F1", label: "Users" }]}
              xAxisKey="ageGroup"
              loading={demographicsLoading}
            />
          </div>
        </section>

        {/* Users Table */}
        <section className="mt-8">
          <DataTable
            data={usersData?.users ?? []}
            columns={userColumns}
            title="All Users"
            searchable
            exportable
            loading={usersLoading}
          />
        </section>
      </main>
    </div>
  );
}
