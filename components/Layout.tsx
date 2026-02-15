import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, Clock3, Home, ListChecks, LogOut, Menu, UserCircle2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { signOutUser } from '../features/configSlice';
import { getPaletteByName } from '../utils/themes';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [time, setTime] = useState(new Date());
  const [showMenu, setShowMenu] = useState(false);

  const {
    isAuthenticated,
    onboardingCompleted,
    shopName,
    themeMode,
    themePalette,
  } = useSelector((state: RootState) => state.config);

  const isAppReady = isAuthenticated && onboardingCompleted;

  const palette = useMemo(() => getPaletteByName(themePalette), [themePalette]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const theme = themeMode === 'dark' ? palette.darkTheme : palette.lightTheme;
    const root = document.documentElement;
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--surface', theme.surface);
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--success', theme.success);
    root.style.setProperty('--warning', theme.warning);
    root.style.setProperty('--danger', theme.danger);
    root.style.setProperty('color-scheme', themeMode === 'dark' ? 'dark' : 'light');
  }, [palette, themeMode]);

  return (
    <div className="min-h-screen bg-app text-app">
      {isAppReady && (
        <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 border-r border-app bg-surface z-40 flex-col">
          <button
            onClick={() => navigate('/')}
            className="h-20 border-b border-app text-left px-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-subtle">Dashboard</p>
            <h1 className="text-2xl font-black text-primary-app">DhandaX Tools</h1>
          </button>
          <nav className="p-4 space-y-2">
            <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${isActive ? 'bg-primary-app text-white' : 'hover:bg-black/5'}`}>
              <Home size={17} /> Home
            </NavLink>
            <NavLink to="/tasks" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${isActive ? 'bg-primary-app text-white' : 'hover:bg-black/5'}`}>
              <ListChecks size={17} /> Tasks
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${isActive ? 'bg-primary-app text-white' : 'hover:bg-black/5'}`}>
              <UserCircle2 size={17} /> Profile
            </NavLink>
          </nav>
          <div className="mt-auto p-4 border-t border-app text-xs text-subtle flex items-center gap-2">
            <Clock3 size={13} />
            {time.toLocaleTimeString()}
          </div>
        </aside>
      )}

      <div className={isAppReady ? 'md:ml-64 min-h-screen flex flex-col' : 'min-h-screen flex flex-col'}>
        <header className="h-16 bg-surface border-b border-app px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {isAppReady && (
              <button onClick={() => setShowMenu(true)} className="md:hidden p-2 rounded-lg border border-app">
                <Menu size={16} />
              </button>
            )}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-subtle">{isAppReady ? 'Dashboard' : 'Landing'}</p>
              <h2 className="text-sm md:text-base font-bold">{shopName || 'DhandaX Tools'}</h2>
            </div>
          </div>
          {isAppReady && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/tasks')}
                title="Notifications"
                className="p-2 rounded-lg border border-app hover:bg-black/5"
              >
                <Bell size={16} />
              </button>
              <button
                onClick={() => navigate('/profile')}
                title="Profile"
                className="p-2 rounded-lg border border-app hover:bg-black/5"
              >
                <UserCircle2 size={16} />
              </button>
            </div>
          )}
        </header>

        <main className="flex-1 p-4 md:p-8 custom-scrollbar overflow-auto">
          <Outlet />
        </main>

        {isAppReady && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-app z-40">
            <div className="grid grid-cols-3">
              <button onClick={() => navigate('/')} className="py-2 text-xs flex flex-col items-center gap-1">
                <Home size={16} /> Home
              </button>
              <button onClick={() => navigate('/tasks')} className="py-2 text-xs flex flex-col items-center gap-1">
                <ListChecks size={16} /> Tasks
              </button>
              <button onClick={() => navigate('/profile')} className="py-2 text-xs flex flex-col items-center gap-1">
                <UserCircle2 size={16} /> Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {showMenu && isAppReady && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50">
          <div className="bg-surface h-full w-[82%] max-w-xs border-r border-app p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Menu</h3>
              <button onClick={() => setShowMenu(false)}><X size={16} /></button>
            </div>
            <div className="space-y-2">
              <button onClick={() => { navigate('/'); setShowMenu(false); }} className="w-full text-left px-3 py-2 rounded-lg border border-app">Home</button>
              <button onClick={() => { navigate('/tasks'); setShowMenu(false); }} className="w-full text-left px-3 py-2 rounded-lg border border-app">Tasks</button>
              <button onClick={() => { navigate('/profile'); setShowMenu(false); }} className="w-full text-left px-3 py-2 rounded-lg border border-app">Profile</button>
              <button
                onClick={() => {
                  dispatch(signOutUser());
                  setShowMenu(false);
                  navigate('/');
                }}
                className="w-full text-left px-3 py-2 rounded-lg border border-[var(--danger)] text-white bg-[color:var(--danger)]/85 flex items-center gap-2"
              >
                <LogOut size={14} /> Logout & Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
