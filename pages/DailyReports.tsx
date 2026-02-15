import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { shareData } from '../utils/share';

const DailyReports: React.FC = () => {
  const invoices = useSelector((state: RootState) => state.pos.invoices);
  const inventory = useSelector((state: RootState) => state.inventory.items);

  const today = new Date().toISOString().slice(0, 10);

  const todayInvoices = useMemo(() => invoices.filter((i) => i.date.slice(0, 10) === today), [invoices, today]);

  const todaySales = todayInvoices.reduce((sum, i) => sum + i.total, 0);
  const paid = todayInvoices.filter((i) => i.paid).reduce((sum, i) => sum + i.total, 0);
  const unpaid = todaySales - paid;

  const modeTotals = todayInvoices.reduce(
    (acc, inv) => {
      acc[inv.paymentMode] = (acc[inv.paymentMode] || 0) + inv.total;
      return acc;
    },
    {} as Record<string, number>,
  );

  const itemMap: Record<string, number> = {};
  todayInvoices.forEach((inv) => inv.items.forEach((it) => (itemMap[it.name] = (itemMap[it.name] || 0) + it.quantity)));
  const topItems = Object.entries(itemMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const profitSnapshot = todayInvoices.reduce((sum, inv) => {
    return (
      sum +
      inv.items.reduce((lineSum, line) => {
        const product = inventory.find((p) => p.name === line.name);
        const cost = product ? product.costPrice * line.quantity : 0;
        const revenue = line.price * line.quantity;
        return lineSum + (revenue - cost);
      }, 0)
    );
  }, 0);

  const downloadReport = () => {
    const payload = {
      date: today,
      todaySales,
      paid,
      unpaid,
      modeTotals,
      topItems,
      profitSnapshot,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily-report-${today}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareReport = () => {
    const text = `Daily Report (${today})\nSales: Rs ${todaySales}\nPaid: Rs ${paid}\nUnpaid: Rs ${unpaid}\nProfit Snapshot: Rs ${Math.round(
      profitSnapshot,
    )}\nTop Items: ${topItems.map((t) => `${t[0]}(${t[1]})`).join(', ') || '-'}`;
    shareData('Daily Report', text);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Daily Reports</h1>
          <p className="text-slate-500">End-of-day clarity in one screen.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-xl" onClick={downloadReport}>Download</button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl" onClick={shareReport}>Share</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-2xl p-4">Today Sales <div className="text-2xl font-black">Rs {todaySales}</div></div>
        <div className="bg-white border rounded-2xl p-4">Paid vs Unpaid <div className="text-sm mt-1">Paid Rs {paid} | Unpaid Rs {unpaid}</div></div>
        <div className="bg-white border rounded-2xl p-4">Profit Snapshot <div className="text-2xl font-black">Rs {Math.round(profitSnapshot)}</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border rounded-2xl p-4">
          <h3 className="font-black mb-2">Payment Modes</h3>
          <div className="space-y-2 text-sm">
            {['Cash', 'UPI', 'Card', 'Split'].map((m) => (
              <div key={m} className="flex justify-between"><span>{m}</span><span className="font-bold">Rs {modeTotals[m] || 0}</span></div>
            ))}
          </div>
        </div>
        <div className="bg-white border rounded-2xl p-4">
          <h3 className="font-black mb-2">Top Items / Services</h3>
          <div className="space-y-2 text-sm">
            {topItems.length === 0 && <div className="text-slate-400">No sales today.</div>}
            {topItems.map(([name, qty]) => (
              <div key={name} className="flex justify-between"><span>{name}</span><span className="font-bold">{qty}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReports;
