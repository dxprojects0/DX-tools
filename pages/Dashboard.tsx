import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, BellDot, CircleDollarSign, Plus, Settings2 } from 'lucide-react';
import { RootState } from '../store/store';
import { PRESET_TOOLS, PROFESSIONS, TOOL_DEFINITIONS } from '../utils/catalog';
import { ToolFeature } from '../types';

const Dashboard: React.FC = () => {
  const { professionId } = useParams();
  const navigate = useNavigate();
  const invoices = useSelector((state: RootState) => state.pos.invoices || []);
  const {
    customTools,
    selectedProfessionId,
    shopName,
    plan,
  } = useSelector((state: RootState) => state.config);

  const categoryId = selectedProfessionId || professionId || 'main';
  const professionName = PROFESSIONS.find((p) => p.id === selectedProfessionId)?.name || 'Dashboard';
  const baseTools = selectedProfessionId ? (PRESET_TOOLS[selectedProfessionId] || []) : [];
  const finalTools: ToolFeature[] = Array.from(new Set([...baseTools, ...customTools]));

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const todaySales = invoices.filter((inv) => inv.date.startsWith(today)).reduce((acc, inv) => acc + inv.total, 0);
  const yesterdaySales = invoices.filter((inv) => inv.date.startsWith(yesterday)).reduce((acc, inv) => acc + inv.total, 0);
  const delta = todaySales - yesterdaySales;
  const deltaPercent = yesterdaySales > 0 ? Math.round((delta / yesterdaySales) * 100) : 0;

  return (
    <div className="space-y-6 pb-20">
      <section className="rounded-3xl border border-app bg-surface p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">{professionName}</p>
        <h1 className="text-3xl font-black mt-1">{shopName || 'Business'} Dashboard</h1>
        <p className="text-sm text-subtle mt-2">
          Welcome back. Category data scope: <span className="font-semibold uppercase">{categoryId}</span>
        </p>
        <div className={`inline-flex items-center gap-1 mt-3 text-sm font-semibold ${delta >= 0 ? 'text-[color:var(--success)]' : 'text-[color:var(--danger)]'}`}>
          {delta >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {Math.abs(deltaPercent)}% vs yesterday
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-app bg-surface p-4">
          <p className="text-xs text-subtle">Revenue Today</p>
          <p className="text-2xl font-black mt-1">Rs {todaySales}</p>
        </div>
        <div className="rounded-2xl border border-app bg-surface p-4">
          <p className="text-xs text-subtle">Yesterday Revenue</p>
          <p className="text-2xl font-black mt-1">Rs {yesterdaySales}</p>
        </div>
        <div className="rounded-2xl border border-app bg-surface p-4">
          <p className="text-xs text-subtle">Active Tools</p>
          <p className="text-2xl font-black mt-1">{finalTools.length}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-app bg-surface p-5">
        <div className="flex flex-wrap items-center gap-2 justify-between mb-3">
          <h2 className="font-black">Recent Transactions</h2>
          <div className="inline-flex items-center gap-2 text-xs text-subtle"><BellDot size={14} /> Notification signals are active</div>
        </div>
        <div className="space-y-2">
          {invoices.slice(-6).reverse().map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between rounded-xl border border-app px-3 py-2">
              <div className="inline-flex items-center gap-2">
                <CircleDollarSign size={15} />
                <span className="text-sm">Invoice #{invoice.id.slice(-4)}</span>
              </div>
              <div className={`text-sm font-bold ${invoice.total >= 0 ? 'text-[color:var(--success)]' : 'text-[color:var(--danger)]'}`}>
                {invoice.total >= 0 ? '+' : '-'} Rs {Math.abs(invoice.total)}
              </div>
            </div>
          ))}
          {invoices.length === 0 && <div className="text-sm text-subtle py-4 text-center">No transactions yet.</div>}
        </div>
      </section>

      <section className="rounded-2xl border border-app bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="font-black">Default Category Tools + Selected Custom Tools</h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/tools/${selectedProfessionId || 'custom'}`)}
              className="px-3 py-2 rounded-lg border border-app text-sm inline-flex items-center gap-1"
            >
              <Settings2 size={14} /> Open tools
            </button>
            <button
              onClick={() => {
                if (plan !== 'pro') {
                  alert('Add more tools is available in Pro plan only.');
                  return;
                }
                navigate('/custom');
              }}
              className="px-3 py-2 rounded-lg bg-primary-app text-white text-sm inline-flex items-center gap-1"
            >
              <Plus size={14} /> Add more tools
            </button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
          {finalTools.map((tool) => {
            const item = TOOL_DEFINITIONS.find((def) => def.id === tool);
            return (
              <button
                key={tool}
                onClick={() => navigate(`/tool/${tool}`)}
                className="shrink-0 rounded-xl border border-app px-4 py-3 min-w-[190px] text-left"
              >
                <p className="text-xs text-subtle">{item?.category || 'Tool'}</p>
                <p className="font-semibold text-sm">{item?.label || tool}</p>
              </button>
            );
          })}
          {finalTools.length === 0 && <p className="text-sm text-subtle">No tools selected yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
