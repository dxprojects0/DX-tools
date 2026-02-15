import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../store/store';

const MonthlyReports: React.FC = () => {
  const { month } = useParams<{ month: string }>();
  const { plan } = useSelector((state: RootState) => state.config);
  const invoices = useSelector((state: RootState) => state.pos.invoices || []);
  const [scanQuery, setScanQuery] = useState('');

  const monthlyInvoices = useMemo(() => {
    if (!month) return [];
    return (invoices || []).filter((invoice) => invoice.date?.startsWith(month));
  }, [month, invoices]);

  if (plan !== 'pro') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-blue-100 rounded-2xl p-6 space-y-3">
          <h1 className="text-2xl font-black text-slate-900">Monthly Data is a Paid Feature</h1>
          <p className="text-sm text-slate-500">Upgrade to Pro to access monthly report view and scanner lookup.</p>
          <button className="shimmer-button text-white px-4 py-2 rounded-lg font-semibold">Upgrade to Pro</button>
        </div>
      </div>
    );
  }

  const foundByScanner = (monthlyInvoices || []).find((invoice) =>
    scanQuery.trim() ? invoice.id.toLowerCase().includes(scanQuery.trim().toLowerCase()) : false,
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Monthly Report: {month}</h1>
        <p className="text-sm text-slate-500">This view is available for Pro users.</p>
      </div>
      {(monthlyInvoices || []).length > 0 ? (
        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-blue-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Invoice</th>
                <th className="p-3">Date</th>
                <th className="p-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {(monthlyInvoices || []).map((invoice) => (
                <tr key={invoice.id}>
                  <td className="p-3">{invoice.id}</td>
                  <td className="p-3">{new Date(invoice.date).toLocaleString()}</td>
                  <td className="p-3 font-bold">Rs {invoice.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-blue-100 rounded-2xl p-6 space-y-3">
          <p className="text-sm text-slate-600">No data found for this month. Scan/search invoice id below:</p>
          <input value={scanQuery} onChange={(e) => setScanQuery(e.target.value)} placeholder="Scanner/ID search..." className="w-full border border-blue-100 rounded-lg p-2 text-sm" />
          {scanQuery.trim() && !foundByScanner && <p className="text-sm text-red-500">No data found.</p>}
          {foundByScanner && (
            <div className="text-sm text-slate-700">Found invoice <span className="font-bold">{foundByScanner.id}</span> with total Rs {foundByScanner.total}.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthlyReports;
