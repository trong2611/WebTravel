import { PlusIcon } from '@heroicons/react/16/solid';
import { RiAddLine, RiEditLine, RiHomeLine, RiMessageLine, RiUserFollowLine, RiVideoOnLine } from '@remixicon/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const SideBar = () => {

    const user = useSelector(state => state.user.user)
  
    return (
        <div className='w-1/4 flex flex-col gap-10'>
            <div className='flex flex-col gap-4 font-medium text-lg items-start shadow-md border-b border-gray-200 z-10'>
                <Link to="/for-you" className='flex items-center px-4 py-2 gap-2 hover:text-blue-500 hover:underline transition duration-200 hover:bg-gray-200 w-full justify-start'>
                    <RiHomeLine size={'22px'}/>
                    Dành cho bạn
                </Link>
                <Link to="/message" className='flex justify-start items-center px-4 py-2 gap-2 hover:text-blue-500 hover:underline transition duration-200 w-full hover:bg-gray-200'>
                    <RiUserFollowLine size={'22px'}/>
                    Đang theo dõi
                </Link>
                <Link to="/following" className='flex justify-start items-center px-4 py-2 gap-2 hover:text-blue-500 hover:underline transition duration-200 w-full hover:bg-gray-200'>
                    <RiMessageLine size={'22px'}/>
                    Tin nhắn
                </Link>
                {
                    user && user.role === 'seller' ?
                    <>
                    <Link to="/create-livestream-room" className='flex justify-start items-center px-4 py-2 gap-2 hover:text-blue-500 hover:underline transition duration-200 w-full hover:bg-gray-200'>
                        <RiVideoOnLine size={'22px'}/>
                        Tạo phòng live
                    </Link>
                    <Link to="/product" className='flex justify-start items-center px-4 py-2 gap-2 hover:text-blue-500 hover:underline transition duration-200 w-full hover:bg-gray-200'>
                        <RiEditLine size={'22px'}/>
                        Quản lý sản phẩm
                    </Link>
                    </>
                    :
                    <></>
                }
            </div>
            <div className='flex flex-col gap-4 font-medium text-lg items-start shadow-md border-b border-gray-200 z-10'>
                <p className='flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-500'>Sản phẩm nổi bật</p>
                <Link to="/" className='flex justify-center items-center px-4 py-2 gap-2 hover:text-blue-500 hover:underline transition duration-200'>
                    Đồ gia dụng
                </Link>
                <Link to="/" className='flex justify-center items-center px-4 py-2 gap-2 hover:text-blue-500 hover:underline transition duration-200'>
                    Đồ điện tử
                </Link>
                <Link to="/" className='flex justify-center items-center px-4 py-2 gap-2 hover:text-blue-500 hover:underline transition duration-200'>
                    Mẹ và bé
                </Link>
            </div>
        </div>
    )

}

export default SideBar;
