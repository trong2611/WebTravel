import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { 
  RiGroupLine, RiHeartLine, RiMoreLine, 
  RiSendPlaneLine, RiShareForwardLine, RiArrowDownLine 
} from '@remixicon/react'
import avatar from '../../../public/avatar.jpg'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const SellerLivestreamRoom = () => {
    const socket = useSelector(state => state.socket.socket)
    const user = useSelector(state => state.user.user)
    const { id } = useParams()
    const navigate = useNavigate()

    const [isProductListVisible, setIsProductListVisible] = useState(false)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [pinnedProduct, setPinnedProduct] = useState(null)
    const messagesEndRef = useRef(null)
    const [product,setProduct] = useState([])

    // Giao diện với scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    const toggleProductList = () => {
        setIsProductListVisible(prevState => !prevState)
    }

    const handleSendMessage = () => {
        if (message.trim() === "") return
        const ms = {
            id: Date.now(), 
            text: message,
            sender: 'Me', 
            avatar: user.avatar 
        }
        setMessages((pre) => [...messages, ms])
        setMessage("")
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
    }, [socket])

    const handleMessageChange = (e) => {
        setMessage(e.target.value)
    }

    // ghim sản phẩm
    const pinProduct = (product) => {
        setPinnedProduct(product)
        socket.emit('pin-product', {roomId: id, product: product})
    }

    // Gỡ ghim sản phẩm
    const unpinProduct = () => {
        setPinnedProduct(null)
        socket.emit('unpin-product', id)
    }

    const localVideoRef = useRef(null)
    const peerConnectionRef = useRef(null)
    const ICE_SERVERS = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    }

    useEffect(() => {
        const roomId = id
        const user = socket.id
    
        const joinRoom = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            })
    
            localVideoRef.current.srcObject = stream
    
            peerConnectionRef.current = new RTCPeerConnection(ICE_SERVERS)
            stream.getTracks().forEach((track) => {
              peerConnectionRef.current.addTrack(track, stream)
            })
    
            peerConnectionRef.current.onicecandidate = (event) => {
              if (event.candidate) {
                socket.emit('ice-candidate', event.candidate, roomId)
              }
            }
    
            socket.emit('join-room', roomId, user, (data) => {
                setProduct(data.products)
            })
    
            const offer = await peerConnectionRef.current.createOffer()
            await peerConnectionRef.current.setLocalDescription(offer)
            socket.emit('offer', offer, roomId)
    
          } catch (error) {
            console.error('Error accessing media devices:', error)
          }
        }
    
        socket.on('answer', (answer) => {
          peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer))
        })
    
        socket.on('ice-candidate', (candidate) => {
          peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
        })

        socket.on('user-joined', (newUser) => {
            console.log(`User ${newUser} joined. Sending offer.`);
            peerConnectionRef.current.createOffer().then((offer) => {
                return peerConnectionRef.current.setLocalDescription(offer);
            }).then(() => {
                socket.emit('offer', peerConnectionRef.current.localDescription, newUser);
            }).catch((error) => {
                console.error('Error creating or sending offer:', error);
            });
        });
    
        joinRoom()
      }, [socket])

    
    //Cancer Phòng
    const cancerRoom = () => {
        socket.emit('cancer-room',parseInt(id), (data) => {
            if(data.success){
                navigate(`/`)
            }else{
                toast(data.message)
            }
        })
    }

    return (
        <div className='w-full flex border-l border-l-gray-400'>
            <div className='relative flex flex-col w-3/4 mt-4'>
                <div className='py-6 px-6 bg-transparent z-50'>
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-4 justify-start items-center'>
                            <div className='flex flex-col'>
                                <div className='flex gap-4 text-white'>
                                    <p className='font-normal text-sm flex'>
                                        <RiGroupLine size={'20px'}/> 12
                                    </p>
                                    <p className='font-normal text-sm flex'>
                                        <RiHeartLine size={'20px'}/> 12
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-4 justify-start items-center text-white'>
                            <button className='py-1 px-1 border border-white rounded-md'>
                                <RiShareForwardLine/>
                            </button>
                            <button className='py-1 px-1 border border-white rounded-md'>
                                <RiMoreLine/>
                            </button>
                            <button className='bg-red-500 text-white px-4 py-2 rounded-md' onClick={cancerRoom}>
                                Rời phòng
                            </button>
                        </div>
                    </div>
                </div>

                <div className='absolute top-0 h-[660px] bg-white overflow-hidden'>
                    <video ref={localVideoRef} autoPlay muted style={{ width: '1200px', height: 'auto' }}></video>
                    
                    {pinnedProduct && (
                        <div className='absolute bottom-10 right-10 bg-white border border-gray-300 rounded-md py-4 px-2 shadow-md flex justify-center items-center flex-col'>
                            <div className='absolute top-[-10px] left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs font-semibold py-1 px-3 rounded-full '>
                                Ghim
                            </div>
                            <img src={pinnedProduct.image} alt={pinnedProduct.name} className='w-28 h-32 object-cover mb-2' />
                            <h4 className='font-semibold text-sm'>{pinnedProduct.name}</h4>
                            <p className='text-gray-500 text-sm'>{pinnedProduct.price}</p>
                            <button onClick={unpinProduct} className='bg-red-500 text-white text-sm py-1 px-3 rounded-md mt-2'>
                                Gỡ ghim
                            </button>
                        </div>
                    )}
                </div>

            </div>

            <div className='flex flex-col w-1/4 border-l border-l-gray-400 h-[630px] relative pt-4'>
                <div className='flex justify-center items-center py-3 shadow-sm border-b border-gray-300'>
                    <h1 className='text-lg font-bold'>Trò chuyện đặt hàng</h1>
                </div>
                <div className='px-4 py-2 bg-gray-100 border-t border-gray-300'>
                    <h2 className='text-sm font-semibold text-gray-700'>Chủ đề phiên live:</h2>
                    <p className='text-sm text-gray-600'>Cùng trò chuyện và đặt hàng ngay nhé!</p>
                </div>

                <div className='flex justify-center items-center py-3'>
                    <button
                      onClick={toggleProductList}
                      className='text-blue-500 font-semibold'
                    >
                      {isProductListVisible ? 'Ẩn danh sách sản phẩm' : 'Xem tất cả sản phẩm'}
                    </button>
                </div>

                {isProductListVisible && (
                    <div className='px-4 py-3 bg-white border-t border-gray-300 overflow-y-auto' style={{ maxHeight: '500px' }}>
                        <h3 className='text-md font-semibold'>Danh sách sản phẩm</h3>
                        <div className='grid grid-cols-2 gap-4'>
                            {product.map(product => (
                                <div key={product.id} className='border p-2 rounded-md'>
                                    <img src={product.image} alt={product.name} className='w-full h-36 object-cover mb-2'/>
                                    <h4 className='font-semibold text-sm'>{product.name}</h4>
                                    <p className='text-gray-500 text-sm'>{product.price}</p>
                                    <button onClick={() => pinProduct(product)} className='bg-red-500 text-white text-md mt-2 px-2 rounded-md'>
                                        Ghim sản phẩm
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chat history */}
                {!isProductListVisible && (
                    <div className='flex flex-col h-[500px] overflow-y-auto px-4 py-2'>
                        {messages.map(msg => (
                            <div key={msg.id} className='flex gap-4 py-2'>
                                <img src={msg.avatar} alt={msg.sender} className='w-8 h-8 rounded-full'/>
                                <div className='flex flex-col'>
                                    <span className='font-semibold'>{msg.sender}</span>
                                    <p className='text-sm'>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {/* Chat input */}
                <div className='flex items-center gap-2 py-3 px-4'>
                    <input
                        type='text'
                        value={message}
                        onChange={handleMessageChange}
                        placeholder='Nhập tin nhắn...'
                        className='flex-1 border border-gray-300 rounded-md p-2'
                    />
                    <button
                        onClick={handleSendMessage}
                        className='bg-blue-500 text-white px-4 py-2 rounded-md'>
                        <RiSendPlaneLine size={20}/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SellerLivestreamRoom
