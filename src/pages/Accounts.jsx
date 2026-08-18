import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import AccountCard from "@/components/AccountCard";
import PageHeader from "@/components/PageHeader";
import AnalyseAccountButton from "@/components/AnalyseAccountButton";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Account.list("-flanksFitScore", 100)
      .then(setAccounts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Accounts" subtitle="The full UK ICP universe across established, ecosystem and emerging segments." demo />
        <AnalyseAccountButton />
      </div>
      {loading ? (
        <div className="text-sm text-slate-400">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((a) => (
            <AccountCard key={a.id} account={a} />
          ))}
        </div>
      )}
    </div>
  );
}