
import {
  Users,
  FolderKanban,
  ListTodo,
  Wallet,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";

const stats = [
  {
    title: "Total Clients",
    value: "48",
    change: "Demo data",
    icon: Users,
    color: "bg-violet-100 text-violet-700",
  },
  {
    title: "Active Projects",
    value: "12",
    change: "Demo data",
    icon: FolderKanban,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Pending Tasks",
    value: "26",
    change: "Demo data",
    icon: ListTodo,
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Total Revenue",
    value: "$24,850",
    change: "Demo data",
    icon: Wallet,
    color: "bg-emerald-100 text-emerald-700",
  },
];

const projects = [
  {
    name: "Corporate Website Redesign",
    client: "Acme Studio",
    status: "In Progress",
    progress: 75,
    deadline: "Oct 20, 2026",
  },
  {
    name: "E-Commerce Platform",
    client: "Urban Store",
    status: "In Progress",
    progress: 45,
    deadline: "Oct 27, 2026",
  },
  {
    name: "Analytics Dashboard",
    client: "Bright Metrics",
    status: "Planning",
    progress: 20,
    deadline: "Nov 5, 2026",
  },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-5 md:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-violet-600">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Welcome to ClientFlow
          </h1>
          <p className="mt-2 text-slate-500">
            Manage your clients, projects, and business activity.
          </p>
        </div>

        <span className="self-start rounded-full bg-violet-100 px-4 py-2 text-xs font-semibold text-violet-700">
          Demo Dashboard
        </span>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={23} />
                </div>
                <ArrowUpRight size={18} className="text-slate-400" />
              </div>

              <p className="mt-5 text-sm text-slate-500">
                {stat.title}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Projects */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Recent Projects
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Example projects for the dashboard preview
            </p>
          </div>
          <FolderKanban className="text-violet-600" size={23} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((project) => (
                <tr key={project.name}>
                  <td className="px-6 py-5">
                    <p className="font-semibold text-slate-900">
                      {project.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {project.client}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                      {project.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-violet-600"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600">
                        {project.progress}%
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays size={16} />
                      {project.deadline}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
