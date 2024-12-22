import { createSlice } from '@reduxjs/toolkit'
import { io } from 'socket.io-client';

const initialState = {
  socket: null,
}

export const ioSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    connectSocket: (state) => {
        if (!state.socket) {
          state.socket = io.connect('http://localhost:8080')
          console.log(`Kết nối socket thành công: ${state.socket}`)
        }
      },
      disconnectSocket: (state) => {
        if (state.socket) {
          state.socket.disconnect()
          state.socket = null
          console.log(`Đóng kết nối socket`)
        }
      }
  }
})

export const { connectSocket, disconnectSocket } = ioSlice.actions
export default ioSlice.reducer