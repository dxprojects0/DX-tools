import React from 'react';

const MarketingTools: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Marketing Tools</h1>
        <p className="text-slate-500 text-sm">Free trial for 3 days for all users. Then ₹ 699/year.</p>
      </div>
      <div className="bg-white border border-blue-100 rounded-2xl p-6">
        <h2 className="font-black text-slate-900 mb-2">Tools</h2>
        <p className="text-sm text-slate-500">This section is intentionally minimal. Add campaign modules as required.</p>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
        <h3 className="font-black text-slate-900">Pricing</h3>
        <p className="text-sm text-slate-600 mt-1">₹ 699/year after 3-day free access, regardless of Free or Pro base plan.</p>
      </div>
    </div>
  );
};

export default MarketingTools;
