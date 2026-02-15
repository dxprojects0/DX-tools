import React from 'react';
import { Check, Crown, LogOut, TriangleAlert } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setPlan, setThemeMode, setThemePalette, signOutUser } from '../features/configSlice';
import { PALETTES } from '../utils/themes';
import { useNavigate } from 'react-router-dom';

const freeFeatures = [
  'Default category tools',
  'Basic reports',
  'Single-device focus',
  'No unlimited add-more tools',
  'No cloud priority',
];

const proFeatures = [
  'Unlimited add-more tools',
  'Cloud priority sync',
  'Advanced analytics',
  'Multi-device support',
  'All premium modules',
];

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    shopName,
    ownerName,
    authEmail,
    selectedProfessionId,
    plan,
    themeMode,
    themePalette,
  } = useSelector((state: RootState) => state.config);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <section className="bg-surface border border-app rounded-2xl p-6">
        <h1 className="text-3xl font-black">Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
          <div className="rounded-xl border border-app p-4">
            <p className="text-subtle text-xs">Name</p>
            <p className="font-semibold">{ownerName || '-'}</p>
          </div>
          <div className="rounded-xl border border-app p-4">
            <p className="text-subtle text-xs">Business</p>
            <p className="font-semibold">{shopName || '-'}</p>
          </div>
          <div className="rounded-xl border border-app p-4">
            <p className="text-subtle text-xs">Email</p>
            <p className="font-semibold">{authEmail || '-'}</p>
          </div>
          <div className="rounded-xl border border-app p-4">
            <p className="text-subtle text-xs">Category</p>
            <p className="font-semibold uppercase">{selectedProfessionId || '-'}</p>
          </div>
        </div>
      </section>

      <section className="bg-surface border border-app rounded-2xl p-6">
        <h2 className="font-black text-xl mb-4">Theme Options</h2>
        <div className="flex gap-2 mb-4">
          <button onClick={() => dispatch(setThemeMode('light'))} className={`px-4 py-2 rounded-lg border ${themeMode === 'light' ? 'border-[var(--primary)]' : 'border-app'}`}>Light</button>
          <button onClick={() => dispatch(setThemeMode('dark'))} className={`px-4 py-2 rounded-lg border ${themeMode === 'dark' ? 'border-[var(--primary)]' : 'border-app'}`}>Dark</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PALETTES.map((palette) => (
            <button
              key={palette.name}
              onClick={() => dispatch(setThemePalette(palette.name))}
              className={`rounded-xl border p-3 text-left ${themePalette === palette.name ? 'border-[var(--primary)]' : 'border-app'}`}
            >
              <p className="font-semibold text-sm">{palette.name}</p>
              <div className="flex gap-1 mt-2">
                <span className="h-5 w-5 rounded-full" style={{ background: palette.primary }} />
                <span className="h-5 w-5 rounded-full" style={{ background: palette.lightTheme.background }} />
                <span className="h-5 w-5 rounded-full" style={{ background: palette.darkTheme.background }} />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-surface border border-app rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <Crown size={18} />
          <h2 className="font-black text-xl">Plans</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <button
            onClick={() => dispatch(setPlan('free'))}
            className={`rounded-xl border p-4 text-left ${plan === 'free' ? 'border-[var(--primary)]' : 'border-app'}`}
          >
            <p className="font-black">FREE MODE ACTIVATED</p>
            <p className="text-xs text-subtle mt-1">Some features are cut and only available in Pro.</p>
            <div className="mt-3 space-y-1">
              {freeFeatures.map((item, idx) => (
                <p key={item} className={`text-sm ${idx >= 3 ? 'line-through text-gray-400' : ''}`}>{item}</p>
              ))}
            </div>
          </button>
          <button
            onClick={() => dispatch(setPlan('pro'))}
            className={`rounded-xl border p-4 text-left ${plan === 'pro' ? 'border-[var(--success)] bg-[color:var(--success)]/5' : 'border-app'}`}
          >
            <p className="font-black">PRO MODE</p>
            <div className="mt-3 space-y-1">
              {proFeatures.map((item) => (
                <p key={item} className="text-sm inline-flex items-center gap-2"><Check size={13} className="text-[color:var(--success)]" /> {item}</p>
              ))}
            </div>
          </button>
        </div>
        {plan === 'free' && (
          <div className="mt-4 rounded-xl border border-[var(--warning)] bg-[color:var(--warning)]/10 p-3 text-sm inline-flex items-center gap-2">
            <TriangleAlert size={14} /> Go Pro to avoid free-mode storage limits and feature caps.
          </div>
        )}
      </section>

      <section className="bg-surface border border-[var(--danger)]/50 rounded-2xl p-6">
        <h2 className="font-black mb-2">Account Actions</h2>
        <p className="text-sm text-subtle mb-4">Logout will reset onboarding so landing/setup appears again next time.</p>
        <button
          onClick={() => {
            dispatch(signOutUser());
            navigate('/');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-[color:var(--danger)] border-2 border-[var(--danger)]"
        >
          <LogOut size={16} /> Logout & Delete Local Session
        </button>
      </section>
    </div>
  );
};

export default Profile;
