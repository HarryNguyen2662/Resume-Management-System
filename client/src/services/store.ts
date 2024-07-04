import type { Action, ThunkAction } from '@reduxjs/toolkit';

import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import resumeSlice from '@/features/cv-management/lib/redux/resumeSlice';
import settingsSlice from '@/features/cv-management/lib/redux/settingsSlice';

import { apiSlice } from './apiSlice';

const rootReducer = combineSlices(apiSlice, {
  resume: resumeSlice,
  settings: settingsSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware().concat(apiSlice.middleware);
    },
    preloadedState,
  });

  setupListeners(store.dispatch);

  return store;
};

export const store = makeStore();

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;
