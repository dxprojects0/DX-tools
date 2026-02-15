import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addLedgerEntry, updateLedgerPayment } from '../features/businessSlice';
import { Search, Share2, UserPlus } from 'lucide-react';
import { shareData } from '../utils/share';
import Drawer from '../components/Drawer';

const Ledger: React.FC = () => {
  const dispatch = useDispatch();
  const entries = useSelector((state: RootState) => state.business.ledger);
  const shopName = useSelector((state: RootState) => state.config.shopName);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payingAmt, setPayingAmt] = useState('');

  const [form, setForm] = useState({ name: '', phone: '', amount: '', items: '', dueDate: '' });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return entries.filter((e) => e.customerName.toLowerCase().includes(q) || e.customerPhone.includes(search));
  }, [entries, search]);

  const outstanding = entries.reduce((acc, e) => acc + (e.amount - e.paid), 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addLedgerEntry({
        id: `UD-${Date.now()}`,
        customerName: form.name,
        customerPhone: form.phone,
        amount: Number(form.amount),
        paid: 0,
        date: new Date().toLocaleDateString(),
        dueDate: form.dueDate || undefined,
        items: form.items,
      }),
    );
    setForm({ name: '', phone: '', amount: '', items: '', dueDate: '' });
    setIsOpen(false);
  };

  const shareSummary = (entry: any) => {
    const text = `Udhaar Summary\nCustomer: ${entry.customerName}\nDate: ${entry.date}\nItems: ${entry.items}\nTotal: Rs ${entry.amount}\nPaid: Rs ${entry.paid}\nDue: Rs ${entry.amount - entry.paid}\n\n- ${shopName || 'ABC Kirana Store'}\n${entry.customerPhone}`;
    shareData('Udhaar Summary', text);
  };

  const submitPayment = (id: string) => {
    const amount = Number(payingAmt) || 0;
    if (amount <= 0) return;
    dispatch(updateLedgerPayment({ id, paidAmount: amount }));
    setPayingAmt('');
    setPayingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Credit (Udhaar)</h1>
          <p className="text-slate-500">Outstanding balance: <span className="font-black">Rs {outstanding}</span></p>
        </div>
        <button onClick={() => setIsOpen(true)} className="px-5 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2">
          <UserPlus size={16} /> Add Credit
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customer" className="w-full outline-none" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Date / Due Date</th>
                <th className="p-3">Total</th>
                <th className="p-3">Paid</th>
                <th className="p-3">Outstanding</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((entry) => {
                const due = entry.amount - entry.paid;
                const settled = due <= 0;
                return (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-bold">{entry.customerName}</div>
                      <div className="text-xs text-slate-500">{entry.customerPhone}</div>
                    </td>
                    <td className="p-3 text-sm">{entry.date}{entry.dueDate ? ` / ${entry.dueDate}` : ''}</td>
                    <td className="p-3">Rs {entry.amount}</td>
                    <td className="p-3">Rs {entry.paid}</td>
                    <td className="p-3 font-bold">Rs {due}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${settled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {settled ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => shareSummary(entry)} className="px-2 py-1 text-xs bg-blue-50 text-primary rounded flex items-center gap-1"><Share2 size={12} /> Share</button>
                        {!settled && (
                          <>
                            {payingId === entry.id ? (
                              <>
                                <input type="number" min="1" className="w-24 border rounded p-1 text-xs" value={payingAmt} onChange={(e) => setPayingAmt(e.target.value)} placeholder="Amount" />
                                <button className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded" onClick={() => submitPayment(entry.id)}>Apply</button>
                              </>
                            ) : (
                              <button className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded" onClick={() => setPayingId(entry.id)}>Partial Pay</button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">No ledger entries.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Drawer title="New Credit Entry" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleAdd} className="space-y-3">
          <input required placeholder="Customer name" className="w-full border rounded p-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required placeholder="Phone" className="w-full border rounded p-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input required type="number" placeholder="Amount" className="w-full border rounded p-2" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <input type="date" className="w-full border rounded p-2" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <textarea placeholder="Items" className="w-full border rounded p-2" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} />
          <button type="submit" className="w-full py-2 bg-primary text-white rounded font-bold">Save</button>
        </form>
      </Drawer>
    </div>
  );
};

export default Ledger;
