import { RiArrowDownLine, RiArrowUpLine } from '@remixicon/react';
import React, { useEffect, useState } from 'react';
import './Room.css'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Room = () => {
  
  const navigate = useNavigate();
  const socket = useSelector(state => state.socket.socket);
  const [rooms, setRooms] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    socket.emit('get-all-room-live', (data) => {
      if (data.success) {
        setRooms(data.liveRooms)
      } else {
        setMessage(data.message)
      }
    })
    socket.on('new-livestream-room', () => {
      socket.emit('get-all-room-live', (data) => {
        if (data.success) {
          setRooms(data.liveRooms)
        } else {
          setMessage(data.message)
        }
      })
    })
    socket.on('seller-cancer-room', () => {
      socket.emit('get-all-room-live', (data) => {
        console.log(data)
        if (data.success) {
          setRooms(data.liveRooms)
        } else {
          setMessage(data.message)
        }
      })
    })
  }, [socket])

  const roomBtnHandle = (roomId) => {
    navigate(`/livestream/${roomId}`)
  }

  return (
    <div className='w-3/4 h-[610px] flex flex-col gap-10 items-center'>
      <h1 className='font-bold text-2xl text-blue-500'>Tất cả phòng livestream</h1>

      {/* Kiểm tra nếu không có phòng livestream */}
      <div className='w-full h-full grid grid-cols-3 gap-5 relative'>
        {rooms.length > 0 ? (
          rooms.map(room => (
            <div key={room.id} className="bg-blue-500 h-[220px] rounded-md overflow-hidden relative cursor-pointer">
              <p className='bg-red-600 px-2 text-center rounded-md font-mono text-white text-md absolute right-4 top-2'>live</p>
              <div className='bottom-4 left-4 px-2 rounded-md font-mono text-white text-md absolute'>
                <p className='text-white line-clamp-2'>{room.title}</p>
              </div>
              <img onClick={() => roomBtnHandle(room.id)} alt='liveroom' src={room.image} className='w-full h-full object-cover'/>
            </div>
          ))
        ) : (
          <p className="text-center w-full text-red-500 text-lg font-semibold absolute">{message}</p>  
        )}
      </div>
    </div>
  )
}

export default Room
