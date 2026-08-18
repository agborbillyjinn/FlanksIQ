import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { DemoModeProvider } from "@/lib/DemoModeContext";
import PresenterGuide from "@/components/intel/PresenterGuide";

export default function Layout() {
  return (
    <DemoModeProvider>
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <div className="pl-64">
          <main className="min-h-screen">
            <Outlet />
          </main>
        </div>
        <PresenterGuide />
      </div>
    </DemoModeProvider>
  );
}