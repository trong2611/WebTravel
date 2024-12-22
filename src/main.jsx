import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App.jsx'
import './index.css'
import {Provider} from 'react-redux'
import store from './redux/store.js'
import { ToastContainer } from 'react-toastify';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import SideBar from './components/SideBar/SideBar.jsx'
import MainContent from './components/MainContent/MainContent.jsx'
import CreateRoom from './components/Seller/CreateRoom.jsx'
import LivestreamRoom from './components/LivestreamRoom/LivestreamRoom.jsx'
import { connectSocket, disconnectSocket } from './redux/slices/ioSlice'
import Room from './components/Room/Room.jsx'
import SellerLivestreamRoom from './components/Seller/LivestreamRoom.jsx'
import Product from './components/Product/Product.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element:<App />,
    children:[
      {
        path: "",
        element: 
          <div className="flex gap-8 px-6 absolute top-24 w-full">
            <SideBar/>
            <Outlet/>
          </div>,
        children: [
          {
            path: "",
            element: <Room/>
          },
          {
            path: "livestream/:id",
            element: <LivestreamRoom/>
          },
          {
            path: "/product",
            element: <Product/>,
          },
        ]
      },
      {
        path: "/create-livestream-room",
        element: <CreateRoom/>,
      },
      {
        path: "/seller-livestream/:id",
        element: <SellerLivestreamRoom/>,
      },
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
])

store.dispatch(connectSocket())

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
      <ToastContainer />
    </StrictMode>
  </Provider>,
)

