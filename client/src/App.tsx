import Clients from "./pages/Clients";
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";

// Future CRM modules
const futurePages = [
  { path: "clients", title: "Clients" },
  { path: "projects", title: "Projects" },
  { path: "tasks", title: "Tasks" },
  { path: "invoices", title: "Invoices" },
  { path: "analytics", title: "Analytics" },
  { path: "settings", title: "Settings" },
];

// Placeholder pages
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="mt-4 text-slate-500">
          This ClientFlow module is under development.
        </p>
      </div>
    </div>
  );
}

// Dashboard layout
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Main application routes
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected CRM pages */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            <Route index element={<Dashboard />} />
<Route path="clients" element={<Clients />} />
            {futurePages.map(({ path, title }) => (
              <Route
                key={path}
                path={path}
                element={<ComingSoon title={title} />}
              />
            ))}

            <Route
              path="*"
              element={<ComingSoon title="Page Not Found" />}
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
