import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addKitchenOrder, updateKitchenStatus } from '../features/businessSlice';
import { ChefHat, CheckCircle, Flame, Plus } from 'lucide-react';

const KitchenDisplay: React.FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.business.kitchenOrders);

  const [table, setTable] = useState('1');
  const [items, setItems] = useState('');

  const activeCount = useMemo(() => orders.filter((o) => o.status !== 'Ready').length, [orders]);

  const createManualOrder = () => {
    if (!items.trim()) return;
    const parsed = items
      .split(',')
      .map((token) => token.trim())
      .filter(Boolean)
      .map((name) => ({ name, qty: 1 }));

    dispatch(
      addKitchenOrder({
        id: `KOT-${Date.now().toString().slice(-5)}`,
        table,
        items: parsed,
        status: 'New',
        startTime: new Date().toISOString(),
      }),
    );
    setItems('');
  };

  const statusColor = (status: string) => {
    if (status === 'New') return 'border-red-300 bg-red-50';
    if (status === 'Preparing') return 'border-orange-300 bg-orange-50';
    return 'border-green-300 bg-green-50';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Kitchen Display</h1>
          <p className="text-slate-500">Orders flow from POS. You can also add direct KOT orders here.</p>
        </div>
        <div className="px-3 py-2 bg-orange-50 text-orange-600 rounded-xl font-bold text-sm">
          <ChefHat size={16} className="inline mr-1" /> {activeCount} Active
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
        <input className="border rounded p-2" placeholder="Table" value={table} onChange={(e) => setTable(e.target.value)} />
        <input className="md:col-span-2 border rounded p-2" placeholder="Items (comma separated)" value={items} onChange={(e) => setItems(e.target.value)} />
        <button className="bg-primary text-white rounded p-2 font-bold" onClick={createManualOrder}><Plus size={14} className="inline mr-1" /> Add Order</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => {
          const elapsed = Math.max(0, Math.floor((Date.now() - new Date(order.startTime).getTime()) / 60000));
          return (
            <div key={order.id} className={`border-2 rounded-2xl ${statusColor(order.status)}`}>
              <div className="p-3 border-b border-slate-200 flex justify-between items-center">
                <div className="font-black">Table {order.table}</div>
                <div className="text-xs text-slate-500">#{order.id.slice(-4)}</div>
              </div>
              <div className="p-3 space-y-2 min-h-[120px]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-bold">x{item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">{elapsed} min</span>
                <div className="flex gap-2">
                  {order.status === 'New' && (
                    <button className="px-2 py-1 bg-orange-500 text-white rounded text-xs" onClick={() => dispatch(updateKitchenStatus({ id: order.id, status: 'Preparing' }))}>
                      <Flame size={12} className="inline mr-1" /> Preparing
                    </button>
                  )}
                  {order.status === 'Preparing' && (
                    <button className="px-2 py-1 bg-green-600 text-white rounded text-xs" onClick={() => dispatch(updateKitchenStatus({ id: order.id, status: 'Ready' }))}>
                      <CheckCircle size={12} className="inline mr-1" /> Ready
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className="p-10 text-center text-slate-400 bg-white border border-dashed rounded-2xl">No kitchen orders yet.</div>
      )}
    </div>
  );
};

export default KitchenDisplay;
