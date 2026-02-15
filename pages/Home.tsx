import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid2X2, Instagram, Menu, Megaphone, Sparkles, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TOOL_DEFINITIONS } from '../utils/catalog';

const animatedLines = [
  'Make your work 10x faster.',
  'Make your operations more efficient.',
  'Make your business cost effective.',
  'Stop data confusion between workflows.',
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [openToolId, setOpenToolId] = useState<string | null>(null);

  const { isAuthenticated, onboardingCompleted } = useSelector((state: RootState) => state.config);
  const ready = isAuthenticated && onboardingCompleted;

  useEffect(() => {
    const id = setInterval(() => {
      setLineIdx((prev) => (prev + 1) % animatedLines.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (ready) {
      navigate('/dashboard/main', { replace: true });
    }
  }, [navigate, ready]);

  const selectedTool = useMemo(
    () => TOOL_DEFINITIONS.find((item) => item.id === openToolId),
    [openToolId],
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12">
      <section className="relative overflow-hidden rounded-3xl border border-app bg-surface p-6 md:p-10">
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl opacity-40 bg-[color:var(--primary)]" />
        <nav className="relative flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-subtle">Home</p>
            <h1 className="text-2xl font-black text-primary-app">DhandaX Tools</h1>
          </div>
          <button onClick={() => setMenuOpen(true)} className="p-2 border border-app rounded-lg">
            <Menu size={18} />
          </button>
        </nav>
        <div className="relative max-w-3xl space-y-4">
          <h2 className="text-3xl md:text-5xl font-black leading-tight">
            Business dashboard for shops, services, and teams.
          </h2>
          <p className="text-lg md:text-2xl font-bold text-primary-app hero-rotator min-h-[2.5rem]">
            {animatedLines[lineIdx]}
          </p>
          <p className="text-subtle text-sm md:text-base max-w-2xl">
            Solve billing, inventory, staff, customer and compliance problems in one app with category-based workflows and role-fit tools.
          </p>
          <button
            onClick={() => navigate('/setup')}
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-app text-white font-semibold"
          >
            <Sparkles size={16} /> Setup your business
          </button>
        </div>
      </section>

      <section id="category" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black">1. Choose Your Business Category</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {['Kirana', 'Pharmacy', 'Clinic', 'Cafe', 'Repair', 'Service'].map((item, idx) => (
            <div key={item} className="aspect-square rounded-2xl border border-app bg-surface p-4 flex items-end float-grid" style={{ animationDelay: `${idx * 120}ms` }}>
              <div>
                <p className="text-xs text-subtle">Category</p>
                <p className="font-bold">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="tools" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black">2. Tools Available In App</h3>
          <span className="text-xs text-subtle">Tap any box to know what it does</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TOOL_DEFINITIONS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setOpenToolId(tool.id)}
              className="rounded-xl border border-app bg-surface p-4 text-left hover:shadow-sm transition-shadow"
            >
              <p className="text-xs text-subtle">{tool.category}</p>
              <p className="font-bold mt-1">{tool.label}</p>
              <p className="text-xs text-subtle mt-1">Tap to view details</p>
            </button>
          ))}
        </div>
      </section>

      <section id="marketing" className="rounded-2xl border border-app bg-surface p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black">3. Marketing Tools</h3>
          <p className="text-subtle text-sm">Promotions and campaign tools for growing repeat customers.</p>
        </div>
        <button onClick={() => navigate('/marketing-tools')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-app text-white text-sm font-semibold">
          <Megaphone size={16} /> Open Marketing Tools
        </button>
      </section>

      <footer id="footer" className="rounded-2xl border border-app bg-surface p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div id="about">
            <h4 className="font-black">About</h4>
            <p className="text-sm text-subtle mt-2">DhandaX Tools helps local businesses manage billing, inventory, reports, workflows, and service operations from one dashboard.</p>
          </div>
          <div id="contact">
            <h4 className="font-black">Contact Us</h4>
            <p className="text-sm text-subtle mt-2">Support for setup, category onboarding, and plan upgrades.</p>
          </div>
          <div>
            <h4 className="font-black">Social</h4>
            <a href="" className="inline-flex items-center gap-2 mt-2 text-sm text-primary-app">
              <Instagram size={16} /> Instagram
            </a>
          </div>
        </div>
      </footer>

      {openToolId && selectedTool && (
        <div className="fixed inset-0 z-50 bg-black/55 p-4 flex items-center justify-center">
          <div className="w-full max-w-lg bg-surface border border-app rounded-2xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-subtle">{selectedTool.category}</p>
                <h4 className="text-xl font-black">{selectedTool.label}</h4>
              </div>
              <button onClick={() => setOpenToolId(null)} className="p-1 rounded-lg border border-app"><X size={14} /></button>
            </div>
            <p className="text-sm text-subtle mt-3">{selectedTool.description}</p>
            <div className="mt-4 text-sm text-subtle">This is an overview modal only. Tool launches after setup and dashboard access.</div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4">
          <div className="max-w-xs bg-surface border border-app rounded-xl p-4 ml-auto">
            <div className="flex items-center justify-between">
              <h4 className="font-bold">Quick Menu</h4>
              <button onClick={() => setMenuOpen(false)}><X size={16} /></button>
            </div>
            <div className="space-y-2 mt-4">
              <a href="#category" onClick={() => setMenuOpen(false)} className="block text-sm border border-app rounded-lg p-2">Category</a>
              <a href="#tools" onClick={() => setMenuOpen(false)} className="block text-sm border border-app rounded-lg p-2">Tools</a>
              <a href="#about" onClick={() => setMenuOpen(false)} className="block text-sm border border-app rounded-lg p-2">About</a>
              <a href="#contact" onClick={() => setMenuOpen(false)} className="block text-sm border border-app rounded-lg p-2">Contact</a>
              <button onClick={() => { setMenuOpen(false); navigate('/setup'); }} className="w-full text-left text-sm border border-app rounded-lg p-2 inline-flex items-center gap-2">
                <Grid2X2 size={15} /> Setup your business
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
