import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from 'react-toastify'

const CreateRoom = () => {
    const socket = useSelector((state) => state.socket.socket)
    const user = useSelector((state) => state.user.user)
    const navigate = useNavigate()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")

    const createRoomBtnHandle = () => {
        const data = {
            title: title,
            description: description,
            image: image
        }
        socket.emit("create-room", data, user.id, (response) => {
            if (response.success) {
                toast("Phòng livestream đã được tạo thành công!");
                navigate(`/seller-livestream/${response.roomId}`);
            } else {
                toast(response.message)
            }
        })
    }

    return (
        <div className="container mx-auto py-6 px-4 space-y-6">
            <h1 className="text-2xl font-bold text-center mb-4">Tạo phòng Livestream</h1>

            <div className="flex space-x-10 justify-center items-center">
                {/* Bên trái - Form nhập liệu */}
                <div className="flex-2 bg-blue-50 p-6 rounded-md shadow-md space-y-6 w-2/3">
                    {/* Tiêu đề và mô tả */}
                    <input
                        type="text"
                        placeholder="Nhập tiêu đề..."
                        className="w-full h-12 px-4 rounded-md border border-gray-400 focus:outline-none"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        rows="4"
                        placeholder="Nhập mô tả..."
                        className="w-full px-4 py-2 rounded-md border border-gray-400 focus:outline-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Link hình ảnh..."
                        className="w-full h-12 px-4 rounded-md border border-gray-400 focus:outline-none"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />

                    {/* Tạo phòng */}
                    <button
                        onClick={createRoomBtnHandle}
                        className="w-full py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
                    >
                        Tạo phòng
                    </button>
                </div>

            </div>
        </div>
    )
}

export default CreateRoom
