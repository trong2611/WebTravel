import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '../reducer/rootReducer'; 
import { thunk } from 'redux-thunk';
import { applyMiddleware } from '@reduxjs/toolkit';

// Tạo store
const store = configureStore({
  reducer: rootReducer,
}, applyMiddleware(thunk));

export default store;