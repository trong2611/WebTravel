import { configureStore } from '@reduxjs/toolkit'

import rootReducer from '../reducer/rootReducer'; 

// Tạo store
const store = configureStore({
  reducer: rootReducer,
});

export default store;