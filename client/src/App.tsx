
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";

const futurePages = [
  { path: "/clients", title: "Clients" },
  { path: "/projects", title: "Projects" },
  { path: "/tasks", title: "Tasks" },
  { path: "/invoices", title: "Invoices" },
  { path: "/analytics", title: "Analytics" },
  { path: "/settings", title: "Settings" },
];

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
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main key={location.pathname}>
          <Routes>
            <Route path="/" element={<Dashboard />} />

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
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
