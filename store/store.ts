
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import inventoryReducer from '../features/inventorySlice';
import repairReducer from '../features/repairSlice';
import configReducer from '../features/configSlice';
import posReducer from '../features/posSlice';
import businessReducer from '../features/businessSlice';
import financeReducer from '../features/financeSlice';
import customerReducer from '../features/customerSlice';
import { saveState } from './persistence';

export const rootReducer = combineReducers({
  inventory: inventoryReducer,
  repairs: repairReducer,
  config: configReducer,
  pos: posReducer,
  business: businessReducer,
  finance: financeReducer,
  customers: customerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const createAppStore = (preloadedState?: Partial<RootState>) => {
  const defaultState = rootReducer(undefined, { type: '@@INIT' });
  const mergedPreloadedState = preloadedState
    ? {
        ...defaultState,
        ...preloadedState,
        config: {
          ...defaultState.config,
          ...preloadedState.config,
        },
      }
    : undefined;

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: mergedPreloadedState,
  });

  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore['dispatch'];
