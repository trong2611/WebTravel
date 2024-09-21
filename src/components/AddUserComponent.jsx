import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewUser } from "../action/actions";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddUserComponent = () => {

    const dispatch = useDispatch()
    const isCreating = useSelector((state) => state.userReducer.isCreating)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")

    const handleCreateNewUser = () => {
        dispatch(createNewUser(email, password, username))
        toast("Add new user successfully!");
        setEmail("")
        setPassword("")
        setUsername("")
    }

    return (
        <div className="grid grid-cols-12 gap-4">
            <input type="text" 
            className="col-span-12 w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Nhập vào email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}/>
            <input type="password" 
            className="col-span-12 w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Nhập vào password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}/>
            <input type="text" 
            className="col-span-12 w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Nhập vào username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}/>
            <button 
            className="col-span-3 border border-green-500 bg-green-500 p-2 rounded hover:outline-none hover:ring-2 hover:ring-green-900 hover:border-green-900"
            onClick={() => handleCreateNewUser()}
            disabled={isCreating}>Thêm user</button>
        </div>
    )

}

export default AddUserComponent;