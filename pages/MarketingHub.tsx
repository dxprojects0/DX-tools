import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, MessageSquareText, Megaphone, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMarketingAccessByCode } from '../utils/firebase';
import { ROUTES } from '../utils/routes';
import Modal from '../components/Modal';

const ACCESS_KEY = 'dx_marketing_access_code';
const FALLBACK_ACCESS = [
  { codeLower: 'dxdemo1', businessName: 'DhandaX Marketing Demo' },
  { codeLower: 'dx502skb', businessName: 'goyal sweets and restaurants' },
];

const MarketingHub: React.FC = () => {
  const navigate = useNavigate();
  const [accessCode, setAccessCode] = useState('');
  const [accessUser, setAccessUser] = useState<{ codeLower: string; businessName: string } | null>(null);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const businessName = accessUser?.businessName || 'Business';

  const resolveAccess = async (rawCode: string) => {
    const codeLower = rawCode.trim().toLowerCase();
    if (!codeLower) return null;

    try {
      const fromDb = await getMarketingAccessByCode(codeLower);
      if (fromDb && (fromDb as any).businessName) {
        return {
          codeLower,
          businessName: String((fromDb as any).businessName),
        };
      }
    } catch {
      // fallback below
    }

    const fallback = FALLBACK_ACCESS.find((item) => item.codeLower === codeLower);
    if (fallback) return fallback;
    return null;
  };

  useEffect(() => {
    const saved = localStorage.getItem(ACCESS_KEY);
    if (!saved) return;
    resolveAccess(saved).then((entry) => {
      if (entry) setAccessUser(entry);
    });
  }, []);

  const unlock = async () => {
    setChecking(true);
    setError('');
    const result = await resolveAccess(accessCode);
    if (!result) {
      setChecking(false);
      setError('Invalid code or not registered.');
      return;
    }
    localStorage.setItem(ACCESS_KEY, result.codeLower);
    setAccessUser(result);
    setAccessCode('');
    setChecking(false);
  };

  const previewMessage = useMemo(
    () =>
      `Hi from ${businessName}.\nWe'd love your feedback today.\nPlease review us and help us grow.`,
    [businessName],
  );

  return (
    <div className="min-h-screen bg-[#f7fbff] text-[#0b1f4d] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <section className="rounded-3xl bg-white shadow-[0_20px_60px_rgba(30,144,255,0.12)] p-6 md:p-10 border border-[#d5e8ff]">
          <p className="text-xs uppercase tracking-[0.22em] text-[#1e90ff] font-semibold">Dedicated Marketing Service</p>
          <h1 className="text-3xl md:text-5xl font-black mt-2">Marketing Tools Workspace</h1>
          <p className="text-sm md:text-base text-[#385173] mt-3 max-w-3xl">
            Increase online presence, improve customer experience, increase revenue, and scale business growth with a separate marketing stack.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => navigate(ROUTES.home)}
              className="px-4 py-2 rounded-xl border border-[#1e90ff]/40 text-[#1e90ff] font-semibold"
            >
              Back to Main App
            </button>
            {!accessUser && (
              <button
                onClick={() => setAccessUser(null)}
                className="px-4 py-2 rounded-xl bg-[#1e90ff] text-white font-semibold"
              >
                Enter Access Code
              </button>
            )}
          </div>
        </section>

        {accessUser && (
          <>
            <section className="rounded-2xl bg-white border border-[#d5e8ff] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[#1e90ff]">Active Business</p>
              <h2 className="text-2xl font-black mt-1">{businessName}</h2>
              <p className="text-sm text-[#385173] mt-1">Code verified from marketing user database.</p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <article className="rounded-2xl bg-white border border-[#d5e8ff] p-5">
                <div className="h-10 w-10 rounded-xl bg-[#1e90ff]/10 text-[#1e90ff] flex items-center justify-center">
                  <MessageSquareText size={18} />
                </div>
                <h2 className="font-black text-lg mt-3">Review Booster</h2>
                <p className="text-sm text-[#385173] mt-1">First tool from marketing suite. Send review prompts with your business name prefilled.</p>
                <div className="mt-3 rounded-xl border border-[#d5e8ff] p-3 bg-[#f7fbff] text-xs whitespace-pre-line">{previewMessage}</div>
              </article>

              <article className="rounded-2xl bg-white border border-[#d5e8ff] p-5">
                <div className="h-10 w-10 rounded-xl bg-[#1e90ff]/10 text-[#1e90ff] flex items-center justify-center">
                  <Megaphone size={18} />
                </div>
                <h2 className="font-black text-lg mt-3">Campaign Booster</h2>
                <p className="text-sm text-[#385173] mt-1">Plan social offers, festive pushes, and repeat-customer campaigns in one place.</p>
              </article>

              <article className="rounded-2xl bg-white border border-[#d5e8ff] p-5">
                <div className="h-10 w-10 rounded-xl bg-[#1e90ff]/10 text-[#1e90ff] flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <h2 className="font-black text-lg mt-3">Customer Experience</h2>
                <p className="text-sm text-[#385173] mt-1">Design follow-ups and personalized re-engagement flows to improve retention.</p>
              </article>
            </section>

            <section className="rounded-2xl bg-white border border-[#d5e8ff] p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-black text-lg">Marketing access unlocked</p>
                <p className="text-sm text-[#385173]">Use this dedicated workspace for demand generation and brand growth.</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1e90ff] text-white font-semibold">
                Open Campaign Studio <ArrowRight size={15} />
              </button>
            </section>
          </>
        )}
      </div>

      {!accessUser && (
        <Modal
          isOpen={!accessUser}
          onClose={() => navigate(ROUTES.home)}
          title="Marketing Access"
          maxWidth="30rem"
          panelClassName="bg-white border border-[#d5e8ff]"
          closeOnBackdrop={false}
        >
          <div className="space-y-3">
            <p className="text-sm text-[#385173]">Enter your access code to continue to marketing tools.</p>
            <input
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter access code (example: dx502skb)"
              className="w-full border border-[#d5e8ff] rounded-xl px-3 py-2 outline-none"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button onClick={unlock} disabled={checking} className="w-full px-4 py-2.5 rounded-xl bg-[#1e90ff] text-white font-semibold disabled:opacity-65">
              {checking ? 'Checking...' : 'Unlock Marketing Tools'}
            </button>
            <div className="text-xs text-[#4e6c93] inline-flex items-center gap-1">
              <ShieldCheck size={12} /> Code is verified from marketing registry.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MarketingHub;
