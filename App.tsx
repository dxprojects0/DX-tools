import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const Setup = lazy(() => import('./pages/Setup'));
const CustomTools = lazy(() => import('./pages/CustomTools'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ToolsView = lazy(() => import('./pages/ToolsView'));
const Profile = lazy(() => import('./pages/Profile'));
const Tasks = lazy(() => import('./pages/Tasks'));
const POS = lazy(() => import('./pages/POS'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Ledger = lazy(() => import('./pages/Ledger'));
const SupplierOrders = lazy(() => import('./pages/SupplierOrders'));
const DailyReports = lazy(() => import('./pages/DailyReports'));
const ExpiryTracking = lazy(() => import('./pages/ExpiryTracking'));
const Appointments = lazy(() => import('./pages/Appointments'));
const HealthRecords = lazy(() => import('./pages/HealthRecords'));
const KitchenDisplay = lazy(() => import('./pages/KitchenDisplay'));
const StaffRoster = lazy(() => import('./pages/StaffRoster'));
const RepairJobs = lazy(() => import('./pages/RepairJobs'));
const WarrantyLogs = lazy(() => import('./pages/WarrantyLogs'));
const InstantBooking = lazy(() => import('./pages/InstantBooking'));
const ExpenseLog = lazy(() => import('./pages/ExpenseLog'));
const MarketingTools = lazy(() => import('./pages/MarketingTools'));
const MonthlyReports = lazy(() => import('./pages/MonthlyReports'));

const PageLoader = () => (
  <div className="h-full min-h-[40vh] flex items-center justify-center">
    <div className="text-sm font-semibold text-slate-500">Loading workspace...</div>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="setup" element={<Setup />} />
            <Route path="dashboard/:professionId" element={<Dashboard />} />
            <Route path="custom" element={<CustomTools />} />
            <Route path="tools/:professionId" element={<ToolsView />} />
            <Route path="profile" element={<Profile />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="marketing-tools" element={<MarketingTools />} />
            <Route path="reports/monthly/:month" element={<MonthlyReports />} />

            <Route path="tool/billing" element={<POS />} />
            <Route path="tool/inventory" element={<Inventory />} />
            <Route path="tool/ledger" element={<Ledger />} />
            <Route path="tool/ordering" element={<SupplierOrders />} />
            <Route path="tool/reports" element={<DailyReports />} />
            <Route path="tool/expiry" element={<ExpiryTracking />} />
            <Route path="tool/appointments" element={<Appointments />} />
            <Route path="tool/ehr" element={<HealthRecords />} />
            <Route path="tool/kitchen" element={<KitchenDisplay />} />
            <Route path="tool/staff" element={<StaffRoster />} />
            <Route path="tool/repairTickets" element={<RepairJobs />} />
            <Route path="tool/warranty" element={<WarrantyLogs />} />
            <Route path="tool/jobBooking" element={<InstantBooking />} />
            <Route path="tool/expenses" element={<ExpenseLog />} />

            <Route
              path="tool/:toolId"
              element={
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="p-8 bg-slate-100 rounded-full text-slate-600 animate-pulse"><Wrench size={48} /></div>
                  <h2 className="text-2xl font-black text-slate-800">Module not found</h2>
                  <p className="text-slate-500 font-medium max-w-sm text-center">This tool ID is unknown. Use Tools screen to launch valid modules.</p>
                  <button onClick={() => window.history.back()} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">Go Back</button>
                </div>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
