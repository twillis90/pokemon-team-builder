import { NavLink } from "react-router-dom";

const link = "px-3 py-2 rounded hover:bg-slate-800";
const active = "bg-slate-800";

export default function Header() {
  return (
    <header className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="font-bold">Pokémon Team Builder</div>
        <nav className="flex gap-2">
          <NavLink to="/" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            Login
          </NavLink>
          <NavLink to="/builder" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            Team Builder
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            Profile
          </NavLink>
          <NavLink to="/badges" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            Badges
          </NavLink>
        </nav>
      </div>
    </header>
  );
}