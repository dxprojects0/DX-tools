import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { ToolFeature } from '../types';
import { PRESET_TOOLS, TOOL_DEFINITIONS } from '../utils/catalog';
import { ChevronRight } from 'lucide-react';

const toolRouteMap: Record<ToolFeature, string> = {
  billing: '/tool/billing',
  inventory: '/tool/inventory',
  ledger: '/tool/ledger',
  ordering: '/tool/ordering',
  reports: '/tool/reports',
  expiry: '/tool/expiry',
  appointments: '/tool/appointments',
  ehr: '/tool/ehr',
  kitchen: '/tool/kitchen',
  staff: '/tool/staff',
  repairTickets: '/tool/repairTickets',
  warranty: '/tool/warranty',
  jobBooking: '/tool/jobBooking',
  expenses: '/tool/expenses',
};

const ToolsView: React.FC = () => {
  const { professionId } = useParams<{ professionId: string }>();
  const navigate = useNavigate();
  const { customTools, selectedProfessionId, plan } = useSelector((state: RootState) => state.config);

  let activeTools: ToolFeature[] = [];
  let title = 'Tools';

  if (professionId === 'custom' || professionId === 'main') {
    const presetTools = selectedProfessionId ? PRESET_TOOLS[selectedProfessionId] || [] : [];
    activeTools = plan === 'pro'
      ? Array.from(new Set([...(customTools || []), ...presetTools]))
      : [...(customTools || [])];
    title = plan === 'pro' ? 'All Selected Tools' : 'Selected Tools';
  } else if (professionId && PRESET_TOOLS[professionId]) {
    activeTools = PRESET_TOOLS[professionId] || [];
    title = `${professionId.charAt(0).toUpperCase()}${professionId.slice(1)} Suite`;
  } else {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <button onClick={() => navigate(`/dashboard/${professionId}`)} className="text-slate-500 font-semibold text-xs hover:underline mb-2 block">Back to Dashboard</button>
          <h1 className="text-3xl font-black text-slate-900">{title}</h1>
          <p className="text-slate-500 text-sm">Select a tool to start working.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-20">
        {(activeTools || []).map((tool) => {
          const def = (TOOL_DEFINITIONS || []).find((item) => item.id === tool);
          return (
            <button
              key={tool}
              onClick={() => navigate(toolRouteMap[tool])}
              className="bg-white p-5 rounded-xl border border-slate-200 text-left hover:shadow-md transition-all"
            >
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">{def?.category || 'Tool'}</p>
              <h3 className="font-black text-slate-900 text-lg mt-1">{def?.label || tool}</h3>
              <p className="text-xs text-slate-500 mt-1">{def?.description || 'Business workflow module'}</p>
              <div className="flex items-center justify-end pt-4">
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ToolsView;
