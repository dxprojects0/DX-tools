import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Megaphone, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TOOL_DEFINITIONS } from '../utils/catalog';
import { ROUTES } from '../utils/routes';
import Modal from '../components/Modal';

const heroKeywords = [
  'Simple ERP for Indian small businesses',
  'Run your entire business from one app',
  'Everything your shop needs, in one place',
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [openToolId, setOpenToolId] = useState<string | null>(null);
  const { isAuthenticated, onboardingCompleted, isAdmin } = useSelector((state: RootState) => state.config);

  const heroBgRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      if (heroBgRef.current) heroBgRef.current.style.transform = `translate3d(0,${y * 0.12}px,0)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated && (onboardingCompleted || isAdmin)) {
      navigate(ROUTES.userDashboard, { replace: true });
    }
  }, [navigate, isAuthenticated, onboardingCompleted, isAdmin]);

  const selectedTool = useMemo(() => TOOL_DEFINITIONS.find((item) => item.id === openToolId), [openToolId]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 space-y-10 pb-20 overflow-x-hidden">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f8fbff] via-white to-[#eaf4ff] shadow-[0_20px_70px_rgba(30,144,255,0.18)]">
        <div ref={heroBgRef} className="hero-bg" style={{ background: 'radial-gradient(circle at 15% 20%, rgba(30,144,255,0.15), transparent 45%), radial-gradient(circle at 86% 18%, rgba(30,144,255,0.11), transparent 42%)' }} />
        <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-[#1e90ff]/12 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-52 w-52 rounded-full bg-[#1e90ff]/10 blur-2xl" />
        <div className="hero-content relative px-4 py-6 sm:px-8 sm:py-10 md:px-12 md:py-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-5 sm:gap-7 items-center">
          <div className="space-y-5 animate-rise">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#3d608d]">Simple ERP Stack</p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight text-[#0f2d66]">
              Run Your Entire Business
              <br />
              From One App
            </h1>
            <p className="text-base md:text-xl font-semibold text-[#1e90ff]">Billing, inventory, reports...</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => navigate(ROUTES.setup)} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e90ff] text-white font-semibold shadow-[0_10px_30px_rgba(30,144,255,0.35)] hover:translate-y-[-1px] transition">
                <Sparkles size={16} /> Start Free
              </button>
              <button onClick={() => navigate(ROUTES.admin)} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#bedcff] text-[#0f2d66] font-semibold bg-white/85">
                Admin Login
              </button>
            </div>
            <p className="text-xs md:text-sm text-[#385173] font-semibold">No credit card required</p>
          </div>

          <div className="rounded-2xl border border-[#cde4ff] bg-white/95 p-4 sm:p-5 animate-rise-delayed space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#1e90ff] font-semibold">Why DX Tools</p>
            {heroKeywords.map((line) => (
              <div key={line} className="rounded-xl border border-[#d8e9ff] bg-[#f7fbff] px-3 py-2 text-sm md:text-base text-[#0f2d66] font-semibold leading-snug">
                {line}
              </div>
            ))}
            <div className="rounded-xl border border-[#d8e9ff] bg-white px-3 py-2 text-sm text-[#385173]">
              Everything your day-to-day operations need in one clean workspace.
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-[#0f2d66]">Available Tools</h3>
          <span className="text-xs text-[#4e6c93]">Tap to preview module</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TOOL_DEFINITIONS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setOpenToolId(tool.id)}
              className="rounded-xl border border-[#cde4ff] bg-white p-4 text-left hover:border-[#1e90ff] hover:bg-[#f4f9ff] transition-all"
            >
              <p className="text-xs text-[#4e6c93]">{tool.category}</p>
              <p className="font-bold mt-1 text-[#0f2d66]">{tool.label}</p>
              <p className="text-xs text-[#4e6c93] mt-1">{tool.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#cde4ff] bg-white p-6 md:p-8 shadow-[0_16px_45px_rgba(30,144,255,0.12)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#1e90ff] font-semibold">Marketing Service</p>
            <h3 className="text-2xl md:text-3xl font-black text-[#0f2d66] mt-1">Open Marketing Tools</h3>
            <p className="text-sm md:text-base text-[#385173] mt-2">
              Use dedicated marketing tools to improve online visibility and grow your customer base.
            </p>
          </div>
          <button
            onClick={() => {
              window.location.href = 'https://google.com';
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1e90ff] text-white font-semibold shadow-[0_10px_25px_rgba(30,144,255,0.3)]"
          >
            <Megaphone size={16} /> Open Marketing Tools
          </button>
        </div>
      </section>

      {openToolId && selectedTool && (
        <Modal
          isOpen={Boolean(openToolId && selectedTool)}
          onClose={() => setOpenToolId(null)}
          title="Tool Preview"
          maxWidth="34rem"
          closeOnBackdrop
        >
          <div className="space-y-3">
            <div>
              <p className="text-xs text-[#4e6c93]">{selectedTool.category}</p>
              <h4 className="text-xl font-black text-[#0f2d66]">{selectedTool.label}</h4>
            </div>
            <p className="text-sm text-[#385173] mt-3">{selectedTool.description}</p>
            <button onClick={() => navigate(ROUTES.setup)} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e90ff] text-white text-sm font-semibold">
              Continue Setup <ArrowRight size={14} />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;
