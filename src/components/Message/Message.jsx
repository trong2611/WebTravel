import React, { useState, useRef, useEffect } from 'react';
import { RiSendPlane2Line } from '@remixicon/react';
import { useSelector } from 'react-redux';
import { 
  RiGroupLine, RiHeartLine, RiMoreLine, 
  RiSendPlaneLine, RiShareForwardLine, RiArrowDownLine 
} from '@remixicon/react'
import { FiImage } from 'react-icons/fi';

const Message = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // Lưu tin nhắn theo userSocket
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Người dùng được chọn
  const socket = useSelector((state) => state.socket.socket);
  const user = useSelector((state) => state.user.user);
  const messagesEndRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  useEffect(() => {
    // Lấy danh sách người dùng online
    socket.emit('get-user-online', (data) => {
      setUsers(data);
    });

    // Lắng nghe sự kiện khi có người dùng mới
    socket.on('new-user-login', () => {
      socket.emit('get-user-online', (data) => {
        setUsers(data);
      });
    });

    // Lắng nghe tin nhắn từ server
    socket.on('private-receive-message', ({ senderSocket, text }) => {
      if (!senderSocket || !text) return;
      console.log({ senderSocket, text });

      // Cập nhật tin nhắn cho người nhận
      setMessages((prevMessages) => {
        const userIndex = prevMessages.findIndex(msg => msg.senderSocket === senderSocket);
        
        if (userIndex === -1) {
          // Nếu người nhận chưa có tin nhắn, tạo mới
          return [...prevMessages, { senderSocket, messages: [{ sender: senderSocket, text }] }];
        } else {
          // Nếu người nhận đã có tin nhắn, kiểm tra xem tin nhắn này đã có chưa
          const updatedMessages = [...prevMessages];
          const lastMessage = updatedMessages[userIndex].messages[updatedMessages[userIndex].messages.length - 1];

          if (lastMessage.text !== text) {  // Đảm bảo tin nhắn không trùng lặp
            updatedMessages[userIndex].messages.push({ sender: senderSocket, text });
          }

          return updatedMessages;
        }
      });
    });

    return () => {
      socket.off('new-user-login');
      socket.off('private-receive-message');
    };
  }, [socket]);

  const sendMessage = () => {
    if (message.trim() !== '' && selectedUser) {
      const newMessage = {
        text: message,
        sender: user.username,
      };

      // Gửi tin nhắn tới server
      socket.emit('private-send-message', {
        receiverSocket: selectedUser.userSocket,
        text: message
      });

      // Lưu tin nhắn của chính mình vào danh sách tin nhắn
      setMessages((prevMessages) => {
        const userIndex = prevMessages.findIndex(msg => msg.senderSocket === selectedUser.userSocket);
  
        if (userIndex === -1) {
          // Nếu không có nhóm tin nhắn cho người nhận, tạo nhóm mới
          return [...prevMessages, { senderSocket: selectedUser.userSocket, messages: [{ sender: 'me', text: message }] }];
        } else {
          const updatedMessages = [...prevMessages];
          
          // Kiểm tra tin nhắn cuối cùng có trùng không
          const lastMessage = updatedMessages[userIndex].messages[updatedMessages[userIndex].messages.length - 1];
          
          // Nếu tin nhắn mới khác tin nhắn cuối cùng, thêm vào
          if (lastMessage.text !== message) {
            updatedMessages[userIndex].messages.push({ sender: 'me', text: message });
          }
          
          return updatedMessages;
        }
      });

      setMessage(''); // Reset input sau khi gửi
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedUser]);

  return (
    <div className="w-full max-w-6xl mx-auto flex gap-8 p-5">
      {/* Danh sách người dùng */}
      <div className="w-1/4 bg-gray-100 p-4 rounded-lg shadow-md space-y-3">
        {users.length > 0 ? (
          users
            .filter((user) => user.userSocket !== socket.id) // Loại bỏ chính mình
            .map((user, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 border-b pb-3 cursor-pointer ${
                  selectedUser?.userSocket === user.userSocket ? 'bg-blue-100' : ''
                }`}
                onClick={() => setSelectedUser(user)} // Chọn người dùng
              >
                <img
                  src={user.user.avatar}
                  alt={user.user.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700">{user.user.username}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              </div>
            ))
        ) : (
          <p className="text-gray-500">Không có người dùng nào trong phòng.</p>
        )}
      </div>

      {/* Vùng hiển thị tin nhắn */}
      <div className="w-3/4 bg-white p-5 rounded-lg shadow-lg flex flex-col gap-4 h-[590px] overflow-auto">
        {/* Tin nhắn */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {selectedUser && messages.length > 0 ? (
            messages
              .filter(msg => msg.senderSocket === selectedUser.userSocket) // Chỉ hiển thị tin nhắn của người chọn
              .map((msgGroup, index) => (
                <div key={index}>
                  {msgGroup.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-md my-3 ${
                        msg.sender === 'me'
                          ? 'bg-blue-100 text-right self-end'
                          : 'bg-gray-200 text-left self-start'
                      }`}
                    >
                      <p className="font-semibold">
                        {msg.sender === 'me' ? 'Bạn' : selectedUser.user.username}: 
                      </p>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>
              ))
          ) : (
            <p className="text-center text-gray-500">
              {selectedUser
                ? 'Chưa có tin nhắn nào với người dùng này.'
                : 'Chọn người dùng để nhắn tin.'}
            </p>
          )}
        </div>

        {/* Vùng nhập tin nhắn */}
        <div className="flex items-center gap-3 mt-3">

            <label htmlFor="file-upload" className="custom-file-input-label cursor-pointer">
            {selectedFile ? selectedFile.name : <FiImage size={'30px'} className='text-blue-500'/>}
            </label>
    
            {/* Input file ẩn */}
            <input 
              type="file" 
              id="file-upload" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: 'none' }}  // Ẩn input gốc
            />

            <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              selectedUser
                ? `Nhắn tin tới ${selectedUser.user.username}...`
                : 'Chọn người dùng để nhắn tin'
            }
            disabled={!selectedUser}
          />

          <button
            onClick={sendMessage}
            className="cursor-pointer p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedUser}
          >
            <RiSendPlane2Line size={24} />
          </button>
        </div>

        {/* Cuộn tới tin nhắn mới */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Message;
