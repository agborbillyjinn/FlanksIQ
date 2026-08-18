import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import PriorityAccountsTable from "@/components/PriorityAccountsTable";
import PageHeader from "@/components/PageHeader";

export default function PriorityAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    base44.entities.Account.list("-priorityScore", 100)
      .then(setAccounts)
      .finally(() => setLoading(false));
  }, []);

  const top = accounts.filter((a) => a.priorityScore >= 75).sort((a, b) => (sortDesc ? b.priorityScore - a.priorityScore : a.priorityScore - b.priorityScore));

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      <PageHeader title="Priority Accounts" subtitle="Accounts scoring 75+ on the Opportunity Priority framework — where sales attention is most warranted right now." demo />
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center text-sm text-slate-400">Loading…</div>
      ) : (
        <PriorityAccountsTable accounts={top} sortBy={sortDesc} onSort={() => setSortDesc((s) => !s)} />
      )}
    </div>
  );
}