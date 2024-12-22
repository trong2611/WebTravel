import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { setUser } from "../redux/slices/userSlice"
import { setProduct } from "../redux/slices/productSlice"

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const nav = useNavigate()
    const socket = useSelector(state => state.socket.socket)
    const dispatch = useDispatch()

    const handleLogin = () => {
        socket.emit('login', { email, password }, (response) => {
            if (response.success === false) {
                toast(response.message)
            } else {
                toast(response.message)
                dispatch(setUser(response.user))
                console.log(`user: ${response.user}`)
                const userId = response.user.id
                socket.emit('get-product-by-sellerId',userId,(data) => {
                    if (data.success) {
                      dispatch(setProduct(data.products))
                    } else {
                      setMessage(data.message);  
                    }
                  });
                nav('/')
            }
        })
    }

    return (
      <div className="container flex px-6 absolute top-24 justify-center items-center">
        <div className="shadow-md border-b bg-blue-50 border-gray-200 z-10 flex flex-col gap-10 justify-center items-centerpy-10 px-4 py-6 h-auto">
            <Link to={"/"} className='text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 text-transparent bg-clip-text transition duration-500 cursor-pointer flex justify-center items-center'>
            ShoppingRooms
            </Link>
            <div className="flex flex-col gap-8 justify-center items-center">
                <div className="flex flex-col gap-6 ">
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" placeholder="Nhập email" className='w-96 h-10 px-4 rounded-md focus:outline-none border border-gray-400'/>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password" placeholder="Nhập password" className='w-96 h-10 px-4 rounded-md focus:outline-none border border-gray-400'/>
                </div>
            </div>
            <div className="w-full flex justify-center items-center flex-col gap-3">
                <button onClick={() => handleLogin()} className="w-32 h-10 rounded-xl text-white font-bold bg-blue-500">Đăng nhập</button>
                <div className="w-full flex justify-center items-center underline">
                    hoặc
                </div>
                <Link to={"/register"} className="px-4 h-10 flex justify-center items-center rounded-xl text-white font-bold bg-blue-500">Đăng ký tài khoản</Link>
            </div>
        </div>
      </div>
    )

}

export default Login;