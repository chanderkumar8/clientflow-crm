
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ListTodo,
  Receipt,
  BarChart3,
  Settings,
  Layers3,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Clients", path: "/clients", icon: Users },
  { name: "Projects", path: "/projects", icon: FolderKanban },
  { name: "Tasks", path: "/tasks", icon: ListTodo },
  { name: "Invoices", path: "/invoices", icon: Receipt },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: Settings },
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="rounded-xl bg-violet-600 p-2.5 text-white">
            <Layers3 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Client<span className="text-violet-600">Flow</span>
            </h1>
            <p className="text-xs text-slate-400">CRM Workspace</p>
          </div>
        </div>

        <nav aria-label="Main navigation" className="flex-1 space-y-1 px-4 py-6">
          {navigation.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Icon size={19} />
              {name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-5">
          <p className="text-sm font-semibold text-slate-800">
            ClientFlow Demo
          </p>
          <p className="text-xs text-slate-500">
            Portfolio development workspace
          </p>
        </div>
      </aside>
    </>
  );
}
