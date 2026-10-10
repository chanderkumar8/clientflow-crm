
import { Bell, Menu, Search, UserRound } from "lucide-react";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={24} />
        </button>

        <div>
          <p className="text-sm text-slate-500">Workspace</p>
          <h2 className="text-lg font-bold text-slate-900">
            Overview
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 md:flex">
          <Search size={17} className="text-slate-400" />
          <span className="text-sm text-slate-400">
            Search (coming soon)
          </span>
        </div>

        <span
          title="Notifications coming soon"
          className="rounded-xl p-2 text-slate-500"
        >
          <Bell size={21} />
        </span>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700">
          <UserRound size={22} />
        </div>
      </div>
    </header>
  );
}
