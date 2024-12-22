import { RiAddLine, RiSearchLine, RiSettingsLine } from '@remixicon/react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from '../../redux/slices/userSlice';

const Header = () => {

    const [searchText, setSearchText] = useState('')
    const nav = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const socket = useSelector(state => state.socket.socket)

    // đăng xuất
    const logoutBtnHandle = () => {
      console.log('log out')
      socket.emit('logout')
      dispatch(setUser(null))
      nav("/login")
    }

    // Tìm kiếm
    const searchBtnHandle = () => {
      console.log('searchBtnHandle')
    }

    return (
        <div className='z-50 flex justify-between items-center fixed top-0 left-0 w-full h-16 bg-white shadow-md px-6 border-b border-gray-200'>
            <Link to={"/"} className='text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 text-transparent bg-clip-text transition duration-500 cursor-pointer'>
                ShoppingRooms
            </Link>
          
            <div className='flex items-center space-x-3 border border-gray-200 rounded-full px-4'>
                <input type='text' placeholder='Tìm kiếm tài khoản' className='w-96 h-10 px-4 rounded-md focus:outline-none' onChange={(e) => setSearchText(e.target.value)}/>
                <RiSearchLine size={'22px'} color='gray' className='cursor-pointer' onClick={() => searchBtnHandle()}/>
            </div>
          
            <div className='flex items-center space-x-4 gap-10'>
                <div className='flex items-center space-x-4'>
                    {
                      user ?
                          <p className='text-red-500 flex gap-2 px-4 font-bold'>
                            Xin chào: <span>{user.username}</span>
                          </p>
                      :<></>
                    }
                    {
                      user ? 
                        <button onClick={logoutBtnHandle} className='bg-blue-500 px-4 py-2 font-semibold hover:underline rounded-md text-white'>
                            Đăng xuất
                        </button>
                      :
                        <button onClick={() => {nav('/login')}} className='bg-blue-500 px-4 py-2 font-semibold hover:underline rounded-md text-white'>
                            Đăng nhập
                        </button>
                    }
                </div>
                <div className='flex items-center space-x-2 cursor-pointer'>
                    <Link to={"/setting"}>
                    <RiSettingsLine size={'22px'} color='gray'/>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Header;
