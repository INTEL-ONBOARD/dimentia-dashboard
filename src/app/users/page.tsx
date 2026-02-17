"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import DataTable from "@/components/tables/DataTable";
import BasePieChart from "@/components/charts/BasePieChart";
import BaseBarChart from "@/components/charts/BaseBarChart";
import { useUsers, useDemographics } from "@/hooks/useApi";
import type { UsersResponse, Demographics } from "@/lib/types";
import { useState } from "react";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Fetch real data with React Query
  const { data: usersData, isLoading: usersLoading } = useUsers({ page, limit: 20, search }) as { data: UsersResponse | undefined; isLoading: boolean };
  const { data: demographics, isLoading: demographicsLoading } = useDemographics() as { data: Demographics | undefined; isLoading: boolean };
  const userColumns = [
    { key: "id", label: "ID", sortable: true },
    { key: "fullName", label: "Full Name", sortable: true },
    { key: "age", label: "Age", sortable: true },
    { key: "gender", label: "Gender", sortable: true },
    { key: "role", label: "Role", sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
          value === 'Patient'
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        }`}>
          {value}
        </span>
      )
    },
    { key: "registeredDate", label: "Registered", sortable: true },
    { key: "lastActive", label: "Last Active", sortable: true },
    { key: "totalSessions", label: "Sessions", sortable: true },
    { key: "totalPoints", label: "Points", sortable: true },
    { key: "status", label: "Status", sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
          value === 'Active'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
        }`}>
          {value}
        </span>
      )
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="ml-[240px] flex-1 py-6 px-8">
        <TopNav title="User Analytics" />

        <section className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            User Demographics
          </h2>
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
              dataKeys={[{ key: "count", color: "#3B82F6", label: "Users" }]}
              xAxisKey="ageGroup"
              loading={demographicsLoading}
            />
          </div>
        </section>

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
