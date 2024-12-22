// import { configureStore } from '@reduxjs/toolkit'
// import rootReducer from '../reducer/rootReducer'; 
// import { thunk } from 'redux-thunk';
// import { applyMiddleware } from '@reduxjs/toolkit';

// Tạo store
// const store = configureStore({
//   reducer: rootReducer,
// }, applyMiddleware(thunk));

// export default store;

import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import userSlice from './slices/userSlice'
import ioSlice from './slices/ioSlice'
import productSlice from './slices/productSlice'

const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userSlice,
    socket: ioSlice,
    product: productSlice
  },
})

export default store