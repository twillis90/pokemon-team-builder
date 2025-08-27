import { Outlet } from "react-router-dom";

export default function AuthedLayout() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <h1 className="text-xl font-semibold">PokéApp</h1>
        </div>
      </header>

      <div className="mx-auto max-w-7xl w-full px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-6">
          <main>
            <Outlet />
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-4 h-[calc(100vh-2rem)] rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Your Teams</h2>
              <p className="text-sm text-slate-400">Sidebar placeholder…</p>
            </div>
          </aside>
        </div>
      </div>

      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
          © {new Date().getFullYear()} PokéApp
        </div>
      </footer>
    </div>
  );
}