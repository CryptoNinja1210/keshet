import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './authSlice' 
// Import your reducers here

export const store = configureStore({
  reducer: {
        auth: authSlice.reducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
