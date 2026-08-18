import React from "react";
import { NavLink } from "react-router-dom";
import { Map, Flame, Building2, Radar, Target, Database } from "lucide-react";

const navItems = [
  { to: "/", label: "UK Territory", icon: Map, end: true },
  { to: "/priority-accounts", label: "Priority Accounts", icon: Flame },
  { to: "/accounts", label: "Accounts", icon: Building2 },
  { to: "/signals", label: "Signals", icon: Radar },
  { to: "/account-strategy", label: "Account Strategy", icon: Target },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[#0b1220] text-slate-300 flex flex-col z-40">
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center font-semibold text-white text-sm tracking-tight">FQ</div>
          <div>
            <div className="text-white font-semibold tracking-tight leading-tight">FlanksIQ</div>
            <div className="text-[10px] text-slate-400 tracking-[0.15em] uppercase">UK Territory</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/5">
        <NavLink
          to="/data-evidence"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`
          }
        >
          <Database className="h-4 w-4" />
          Data & Evidence
        </NavLink>
      </div>
    </aside>
  );
}