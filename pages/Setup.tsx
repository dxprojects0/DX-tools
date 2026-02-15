import React, { useMemo, useState } from 'react';
import { Check, CheckCircle2, Lock, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import {
  completeOnboarding,
  markAuthenticated,
  setOwnerName,
  setPlan,
  setProfession,
  setShopName,
} from '../features/configSlice';
import { PROFESSIONS, PRESET_TOOLS } from '../utils/catalog';
import { signInWithGoogle } from '../utils/firebase';

const freeFeatures = [
  { label: 'Core dashboard access', proOnly: false },
  { label: 'Default category tools', proOnly: false },
  { label: 'Basic reports', proOnly: false },
  { label: 'Add unlimited extra custom tools', proOnly: true },
  { label: 'Cloud-first sync priority', proOnly: true },
  { label: 'Advanced analytics', proOnly: true },
];

const proFeatures = [
  'Core dashboard access',
  'All default category tools',
  'Unlimited custom tools',
  'Cloud-first sync priority',
  'Advanced analytics',
  'Multi-device workflow',
];

const Setup: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    shopName,
    ownerName,
    selectedProfessionId,
    isAuthenticated,
    onboardingCompleted,
    plan,
  } = useSelector((state: RootState) => state.config);

  const [shop, setShop] = useState(shopName);
  const [owner, setOwner] = useState(ownerName);
  const [selectedCategory, setSelectedCategory] = useState(selectedProfessionId || '');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const lockedSetup = Boolean(selectedProfessionId && onboardingCompleted);
  const selectedToolCount = useMemo(
    () => (selectedCategory ? (PRESET_TOOLS[selectedCategory] || []).length : 0),
    [selectedCategory],
  );

  if (isAuthenticated && onboardingCompleted) {
    return <Navigate to="/dashboard/main" replace />;
  }

  const nextStep = () => {
    setError('');
    if (step === 1) {
      if (!shop.trim() || !owner.trim() || !selectedCategory) {
        setError('Business name, owner name, and category are required.');
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!isAuthenticated) {
        setError('Please login first.');
        return;
      }
      setStep(3);
      return;
    }
    if (step === 3) {
      dispatch(setShopName(shop.trim()));
      dispatch(setOwnerName(owner.trim()));
      dispatch(setProfession(selectedCategory));
      dispatch(completeOnboarding());
      navigate('/dashboard/main');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const user = await signInWithGoogle();
      dispatch(markAuthenticated({ uid: user.uid, method: 'google', email: user.email }));
    } catch (e: any) {
      setError(e?.message || 'Google login failed.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-surface border border-app rounded-2xl p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-subtle">Setup your business</p>
        <h1 className="text-3xl font-black mt-1">Create your workspace</h1>
        <p className="text-subtle text-sm mt-2">Sequence: Category and business details → Login → Plan selection → Dashboard</p>
      </div>

      {lockedSetup && (
        <div className="bg-surface border border-[var(--warning)] rounded-xl p-4 text-sm flex items-start gap-2">
          <Lock size={16} className="mt-0.5" />
          Category is already locked for this user. You can continue to dashboard or logout/reset to choose a new business.
        </div>
      )}

      <section className="bg-surface border border-app rounded-2xl p-6">
        <h2 className="font-black mb-4">Step 1: Category + Business</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <input
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            placeholder="Business name"
            className="border border-app bg-transparent rounded-lg px-3 py-2 outline-none"
            disabled={lockedSetup}
          />
          <input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Owner name"
            className="border border-app bg-transparent rounded-lg px-3 py-2 outline-none"
            disabled={lockedSetup}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PROFESSIONS.map((profession) => (
            <button
              key={profession.id}
              onClick={() => setSelectedCategory(profession.id)}
              disabled={lockedSetup}
              className={`aspect-square rounded-xl border p-4 text-left ${selectedCategory === profession.id ? 'border-[var(--primary)] bg-[color:var(--primary)]/10' : 'border-app'} ${lockedSetup ? 'opacity-60' : ''}`}
            >
              <p className="font-bold">{profession.name}</p>
              <p className="text-xs text-subtle mt-2">{profession.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-surface border border-app rounded-2xl p-6">
        <h2 className="font-black mb-4">Step 2: Login with Firebase</h2>
        {!isAuthenticated ? (
          <button onClick={handleGoogleLogin} className="px-4 py-2 rounded-lg bg-primary-app text-white font-semibold">
            Login with Google
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 text-[color:var(--success)] text-sm font-semibold">
            <CheckCircle2 size={16} /> Logged in successfully
          </div>
        )}
      </section>

      <section className="bg-surface border border-app rounded-2xl p-6">
        <h2 className="font-black mb-4">Step 3: Choose Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => dispatch(setPlan('free'))}
            className={`rounded-xl border p-4 text-left ${plan === 'free' ? 'border-[var(--primary)]' : 'border-app'}`}
          >
            <h3 className="font-black">Free Mode Activated</h3>
            <p className="text-xs text-subtle mb-3">Good for starter usage. Some features are cut and available only in Pro.</p>
            <div className="space-y-1">
              {freeFeatures.map((feature) => (
                <div key={feature.label} className={`text-sm ${feature.proOnly ? 'text-gray-400 line-through' : ''}`}>
                  {feature.label}
                </div>
              ))}
            </div>
          </button>
          <button
            onClick={() => dispatch(setPlan('pro'))}
            className={`rounded-xl border p-4 text-left ${plan === 'pro' ? 'border-[var(--success)] bg-[color:var(--success)]/5' : 'border-app'}`}
          >
            <h3 className="font-black">Pro Plan</h3>
            <p className="text-xs text-subtle mb-3">All premium features unlocked.</p>
            <div className="space-y-1">
              {proFeatures.map((feature) => (
                <div key={feature} className="text-sm inline-flex items-center gap-2">
                  <Check size={14} className="text-[color:var(--success)]" /> {feature}
                </div>
              ))}
            </div>
          </button>
        </div>
        <div className="mt-4 text-xs text-subtle">
          Default tools in selected category: {selectedToolCount}
        </div>
      </section>

      {error && (
        <div className="bg-[color:var(--danger)]/10 border border-[var(--danger)] rounded-xl p-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="px-4 py-2 border border-app rounded-lg">Back</button>
        )}
        <button onClick={nextStep} className="px-4 py-2 rounded-lg bg-primary-app text-white font-semibold">
          {step < 3 ? 'Next' : 'Go To Dashboard'}
        </button>
        <button onClick={() => navigate('/')} className="px-4 py-2 border border-app rounded-lg inline-flex items-center gap-2">
          <X size={14} /> Cancel
        </button>
      </div>
    </div>
  );
};

export default Setup;
