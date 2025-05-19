import { rootReducer } from './reducers/rootReducer';
import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

// Типизация RootState на основе rootReducer
export type RootState = ReturnType<typeof rootReducer>;

// Типизация AppDispatch (включает поддержку thunk)
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;
