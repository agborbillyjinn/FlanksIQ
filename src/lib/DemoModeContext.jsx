import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { presentSteps } from "@/components/intel/presentSteps";

const DemoModeContext = createContext(null);
export const useDemoMode = () => useContext(DemoModeContext);

export function DemoModeProvider({ children }) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [accountId, setAccountId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const targetPath = (s) => (s.page === "dashboard" ? "/" : `/accounts/${accountId}`);

  // Navigate + scroll/highlight whenever the step changes (or route lands)
  useEffect(() => {
    if (!active) return;
    const s = presentSteps[step];
    if (!s) return;
    const want = targetPath(s);
    if (location.pathname !== want) {
      navigate(want);
      return;
    }
    let cancelled = false;
    let attempts = 0;
    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(s.target);
      attempts += 1;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.add("demo-highlight");
        setTimeout(() => el.classList.remove("demo-highlight"), 1800);
      } else if (attempts < 30) {
        setTimeout(tryScroll, 120);
      }
    };
    const t = setTimeout(tryScroll, 90);
    return () => { cancelled = true; clearTimeout(t); };
  }, [active, step, location.pathname, accountId]);

  // Keyboard shortcuts (only while demo mode is active)
  useEffect(() => {
    if (!active) return;
    const handler = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); setStep((c) => Math.min(c + 1, presentSteps.length - 1)); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); setStep((c) => Math.max(c - 1, 0)); }
      else if (e.key === "Escape") { setActive(false); setStep(0); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active]);

  const start = useCallback((fromDashboard, accId) => {
    setAccountId(accId);
    setActive(true);
    setStep(fromDashboard ? 0 : 1);
    if (fromDashboard && location.pathname !== "/") navigate("/");
  }, [location.pathname, navigate]);

  const exit = useCallback(() => { setActive(false); setStep(0); }, []);
  const next = useCallback(() => setStep((c) => Math.min(c + 1, presentSteps.length - 1)), []);
  const prev = useCallback(() => setStep((c) => Math.max(c - 1, 0)), []);

  return (
    <DemoModeContext.Provider value={{ active, step, accountId, start, exit, next, prev }}>
      {children}
    </DemoModeContext.Provider>
  );
}