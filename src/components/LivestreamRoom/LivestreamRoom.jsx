import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { 
  RiGroupLine, RiHeartLine, RiMoreLine, 
  RiSendPlaneLine, RiShareForwardLine, RiArrowDownLine 
} from '@remixicon/react'
import avatar from '../../../public/avatar.jpg'
import sampleImage from '../../../public/liveroom.jpg'
import { useNavigate, useParams } from 'react-router-dom'
import { data } from 'autoprefixer'

const LivestreamRoom = () => {
    const socket = useSelector(state => state.socket.socket)
    const user = useSelector(state => state.user.user)
    const { id } = useParams()
    const navigate = useNavigate()
    const [isProductListVisible, setIsProductListVisible] = useState(false)
    const [pinnedProduct, setPinnedProduct] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [showChatHistory, setShowChatHistory] = useState(true)
    const messageContainerRef = useRef(null)
    const [products, setProducts] = useState([])
    const [information, setInformation] = useState({})
    const [isBuyProduct, setIsBuyProduct] = useState(false)

    useEffect(() => {
      messageContainerRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    const toggleProductList = () => {
        setIsProductListVisible(!isProductListVisible)
    }

    const sendMessage = () => {
        if (newMessage.trim() === "") return
        const ms = {
            id: Date.now(), 
            text: newMessage,
            sender: 'Me', 
            avatar: user.avatar 
        }
        setMessages((pre) =>[...messages, ms])
        setNewMessage("")
        socket.emit('send-message',{username: user.username, avatar: user.avatar, roomId: id, message: ms})
    }

    useEffect(() => {
        socket.on('new-message', (data) => {
            const newMessage = {
                id: Date.now(), 
                text: data.message,
                sender: data.username, 
                avatar: data.avatar 
            }
            setMessages((pre) =>[...messages, newMessage])
        })

        socket.on('pined-product', (data) => {
            setPinnedProduct(data)
            console.log(data)
        })

        socket.on('unpined-product', () => {
            setPinnedProduct(null)
        })

        socket.on('seller-cancer-room', () => {
          alert('Người bán đã tắt phát trực tiếp!')
          navigate(`/`)
        })
        
    }, [socket])

    
    useEffect(() => {
        if (isProductListVisible) {
            setShowChatHistory(false)
        } else {
            setShowChatHistory(true)
        }
    }, [isProductListVisible])

    const leaveRoom = () => {
      console.log("Rời phòng")
    }

    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const ICE_SERVERS = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    };
  
    useEffect(() => {
      const roomId = id
      const user = socket.id
      const joinRoom = async () => {
        try {
          peerConnectionRef.current = new RTCPeerConnection(ICE_SERVERS);
          peerConnectionRef.current.ontrack = (event) => {
            const [stream] = event.streams;
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream;
            }
          };
  
          peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
              socket.emit('ice-candidate', event.candidate, roomId);
            }
          };
  
          socket.emit('join-room', roomId, user, (data) => {
            setProducts(data.products)
            setInformation(data.information[0])
          });

        } catch (error) {
          console.error('Error initializing peer connection:', error);
        }
      };
      joinRoom();

      socket.on('offer', (offer, fromUser) => {
        console.log('Received offer from', fromUser);
        peerConnectionRef.current
            .setRemoteDescription(new RTCSessionDescription(offer))
            .then(() => {
                return peerConnectionRef.current.createAnswer();
            })
            .then((answer) => {
                return peerConnectionRef.current.setLocalDescription(answer);
            })
            .then(() => {
                socket.emit('answer', peerConnectionRef.current.localDescription, fromUser);
            })
            .catch((error) => {
                console.error('Error handling offer:', error);
            });
      });
  
      socket.on('ice-candidate', (candidate) => {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch((error) => {
          console.error('Error adding ice candidate:', error);
        });
      });
  
    }, []);
    

    return (
        <div className='w-3/4 flex border-l border-l-gray-400'>
            <div className='flex flex-col w-3/4'>
                <div className='py-4 px-6 bg-white'>
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-4 justify-start items-center'>
                            <div className='overflow-hidden rounded-full w-12 h-12 cursor-pointer'>
                               <img alt='avatar' src={information.avatar} className='w-full h-full'/>
                            </div>
                            <div className='flex flex-col'>
                                <p className='font-semibold text-md'>Tên: {information.username}</p>
                                <div className='flex gap-4 text-gray-500'>
                                    <p className='font-normal text-sm flex'>
                                        <RiGroupLine size={'20px'}/>
                                        12
                                    </p>
                                    <p className='font-normal text-sm flex'>
                                        <RiHeartLine size={'20px'}/>
                                        12
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-4 justify-start items-center text-gray-700'>
                            <button className='py-1 px-1 border border-gray-300 rounded-md'><RiShareForwardLine/></button>
                            <button className='py-1 px-1 border border-gray-300 rounded-md'><RiMoreLine/></button>
                            <button className='py-1 px-4 border border-gray-300 rounded-md hover:bg-red-500 hover:text-white'>Theo dõi</button>
                        </div>
                    </div>
                </div>
                <div className='h-[500px] bg-white overflow-hidden relative'>
                      <video  ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} ></video>
                      {pinnedProduct && (
                        <div className='absolute bottom-10 right-10 bg-white bg-opacity-70 border border-gray-300 rounded-md py-4 px-2 shadow-md flex justify-center items-center flex-col'>
                          <div className='absolute top-[-10px] left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs font-semibold py-1 px-3 rounded-full'>
                            Ghim
                          </div>
                          <img src={pinnedProduct.image} alt={pinnedProduct.name} className='w-20 h-24 object-cover mb-2' />
                          <h4 className='font-semibold text-sm'>{pinnedProduct.name}</h4>
                          <p className='text-gray-500 text-sm'>{pinnedProduct.price}</p>
                          <button className='bg-red-500 text-white text-xs py-1 px-3 rounded-md mt-2'>
                            Đặt hàng ngay
                          </button>
                        </div>
                      )}
                </div>
                <div className='relative my-2'>
                  <button className='absolute left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-md flex'>
                      <RiArrowDownLine size={'20px'} className='mr-2' />
                      Chuyển phòng
                  </button>
                  <button 
                      onClick={leaveRoom} 
                      className='absolute right-4 bg-red-500 text-white px-4 py-2 rounded-md'>
                      Rời phòng
                  </button>
                </div>
            </div>

            <div className='flex flex-col w-1/4 border-l border-l-gray-400 h-[630px] relative'>
                <div className='flex justify-center items-center py-3 shadow-sm border-b border-gray-300'>
                    <h1 className='text-lg font-bold'>Trò chuyện đặt hàng</h1>
                </div>
                
                <div className='px-4 py-2 bg-gray-100 border-t border-gray-300'>
                    <h2 className='text-sm font-semibold text-gray-700'>Chủ đề phiên live: {information.title}</h2>
                    <p className='text-sm text-gray-600'> Cùng trò chuyện và đặt hàng ngay nhé!</p>
                    <p className='text-sm text-gray-600'> Mô tả: {information.description}</p>
                </div>

                <div className='flex justify-center items-center py-3'>
                    <button className='text-blue-500 font-semibold' onClick={toggleProductList}>
                      {isProductListVisible ? 'Ẩn danh sách sản phẩm' : 'Xem tất cả sản phẩm'}
                    </button>
                </div>

                {isProductListVisible && (
                    <div className='px-4 py-3 bg-white border-t border-gray-300 overflow-y-auto h-[8000px]'>
                        <h3 className='text-md font-semibold'>Danh sách sản phẩm</h3>
                        <div className='grid grid-cols-2 gap-4'>
                            {products.map(product => (
                                <div key={product.id} className='border p-2 rounded-md'>
                                    <img src={product.image} alt={product.name} className='w-full h-32 object-cover mb-2'/>
                                    <h4 className='font-semibold text-sm'>{product.name}</h4>
                                    <p className='text-gray-500 text-sm'>{product.price}</p>
                                    <button 
                                      onClick={() => alert(`Xem chi tiết sản phẩm: ${product.name}`)}
                                      className='text-blue-500 text-xs mt-2'>
                                        Xem sản phẩm
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chat messages */}
                {showChatHistory && (
                    <div
                      className='flex flex-col h-[500px] overflow-y-auto px-4 py-2 bg-white'
                      ref={messageContainerRef}
                    >
                        {messages.map((message, index) => (
                            <div key={index} className='flex items-center py-2'>
                                <div className='flex-shrink-0 w-8 h-8 rounded-full overflow-hidden'>
                                    <img src={avatar} alt="Avatar" className='w-full h-full object-cover'/>
                                </div>
                                <div className='ml-2'>
                                    <p className='font-semibold'>{message.sender}</p>
                                    <p className='text-sm'>{message.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Chat input */}
                <div className='flex justify-between items-center border-t border-gray-300 p-2'>
                    <input
                      type='text'
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className='w-full p-2 rounded-md border border-gray-300'
                      placeholder='Nhập tin nhắn...'
                    />
                    <button 
                      onClick={sendMessage} 
                      className='p-2 rounded-md bg-blue-500 text-white'>
                      <RiSendPlaneLine size='20px'/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LivestreamRoom;
