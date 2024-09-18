const AddUserComponent = () => {

    return (
        <div className="grid grid-cols-12 gap-4">
            <input type="text" className="col-span-12 w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập vào email"/>
            <input type="text" className="col-span-12 w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập vào password"/>
            <input type="text" className="col-span-12 w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập vào username"/>
            <button className="col-span-3 border border-green-500 bg-green-500 p-2 rounded hover:outline-none hover:ring-2 hover:ring-green-900 hover:border-green-900">Thêm user</button>
        </div>
    )

}

export default AddUserComponent;