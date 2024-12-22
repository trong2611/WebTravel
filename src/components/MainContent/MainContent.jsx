import React from 'react';
import Room from '../Room/Room';
import LivestreamRoom from '../LivestreamRoom/LivestreamRoom';
import { Route, Routes } from 'react-router-dom';

const MainContent = () => {

  return (
    // <div className='w-3/4 flex flex-col gap-10'>
    //     <div className='w-full justify-center items-center text-center'>
    //         <h1 className='font-bold text-2xl text-blue-500'>Tất cả phòng livestream</h1>
    //     </div>
    //     <div className='w-full grid grid-cols-1 gap-10'>
    //         {/* <Room/> */}
    //         <LivestreamRoom/>
    //     </div>
    // </div>
    // <LivestreamRoom/>
    
      <Routes>
        <Route path="/" element={<Room />} />
        <Route path="/livestream" element={<LivestreamRoom/>} />
      </Routes>
  )

}

export default MainContent;
