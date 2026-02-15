import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConfigState, ToolFeature } from '../types';

const initialState: ConfigState = {
  shopName: '',
  ownerName: '',
  hasSeenPrompt: false,
  selectedProfessionId: null,
  onboardingCompleted: false,
  customTools: [],
  firstUseAt: null,
  lastLoginPromptDate: null,
  isAuthenticated: false,
  authUid: null,
  authEmail: null,
  authMethod: null,
  plan: 'free',
  proStartedAt: null,
  lastCloudSyncAt: null,
  tasks: [],
  themeMode: 'light',
  themePalette: 'Corporate Blue (Default)',
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setShopName: (state, action: PayloadAction<string>) => {
      state.shopName = action.payload;
      state.hasSeenPrompt = true;
      if (!state.firstUseAt) state.firstUseAt = new Date().toISOString();
    },
    setOwnerName: (state, action: PayloadAction<string>) => {
      state.ownerName = action.payload;
      state.hasSeenPrompt = true;
      if (!state.firstUseAt) state.firstUseAt = new Date().toISOString();
    },
    setProfession: (state, action: PayloadAction<string>) => {
      if (!state.selectedProfessionId) {
        state.selectedProfessionId = action.payload;
      }
    },
    toggleCustomTool: (state, action: PayloadAction<ToolFeature>) => {
      const exists = state.customTools.includes(action.payload);
      if (exists) {
        state.customTools = state.customTools.filter(t => t !== action.payload);
      } else {
        state.customTools.push(action.payload);
      }
    },
    setCustomTools: (state, action: PayloadAction<ToolFeature[]>) => {
      state.customTools = action.payload;
    },
    markLoginPromptShownToday: (state, action: PayloadAction<string>) => {
      state.lastLoginPromptDate = action.payload;
    },
    markAuthenticated: (state, action: PayloadAction<{ uid: string; method: 'google' | 'phone'; email?: string | null }>) => {
      state.isAuthenticated = true;
      state.authUid = action.payload.uid;
      state.authMethod = action.payload.method;
      state.authEmail = action.payload.email || null;
    },
    signOutUser: (state) => {
      const preservedPalette = state.themePalette;
      const preservedMode = state.themeMode;
      Object.assign(state, initialState);
      state.themePalette = preservedPalette;
      state.themeMode = preservedMode;
    },
    completeOnboarding: (state) => {
      state.onboardingCompleted = true;
      state.hasSeenPrompt = true;
      if (!state.firstUseAt) state.firstUseAt = new Date().toISOString();
    },
    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.themeMode = action.payload;
    },
    setThemePalette: (state, action: PayloadAction<string>) => {
      state.themePalette = action.payload;
    },
    setPlan: (state, action: PayloadAction<'free' | 'pro'>) => {
      state.plan = action.payload;
      if (action.payload === 'pro' && !state.proStartedAt) {
        state.proStartedAt = new Date().toISOString();
      }
    },
    setLastCloudSyncAt: (state, action: PayloadAction<string>) => {
      state.lastCloudSyncAt = action.payload;
    },
    addTask: (state, action: PayloadAction<string>) => {
      const title = action.payload.trim();
      if (!title) return;
      state.tasks.push({
        id: `task-${Date.now()}`,
        title,
        done: false,
        createdAt: new Date().toISOString(),
      });
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) task.done = !task.done;
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    }
  },
});

export const {
  setShopName,
  setOwnerName,
  setProfession,
  toggleCustomTool,
  setCustomTools,
  markLoginPromptShownToday,
  markAuthenticated,
  signOutUser,
  completeOnboarding,
  setThemeMode,
  setThemePalette,
  setPlan,
  setLastCloudSyncAt,
  addTask,
  toggleTask,
  deleteTask,
} = configSlice.actions;
export default configSlice.reducer;
