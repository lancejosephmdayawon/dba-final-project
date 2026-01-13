"use client";

import { useEffect, useState } from "react";
import { Wallet, CheckCircle, List } from "lucide-react";

export default function SummaryCards() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/transactions/summary")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return null;

  const peso = (v) => `₱${Number(v || 0).toFixed(2)}`;

  return (
    <div className="m-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card icon={Wallet} label="Pending Balance" value={peso(data.pendingBalance)} />
      <Card icon={CheckCircle} label="Collected" value={peso(data.collectedAmount)} />
      <Card icon={List} label="Transactions" value={data.totalTransactions} />
    </div>
  );
}

function Card({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border shadow-sm">
      <div className="p-3 bg-blue-50 rounded-xl">
        <Icon className="text-blue-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
