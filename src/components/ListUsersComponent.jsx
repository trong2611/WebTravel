import { Card, Typography } from "@material-tailwind/react";
import axios from "axios"
import { useEffect, useState } from "react"

const TABLE_HEAD = ["Id", "Username", "Email", "Action"];
 
const ListUsersComponent = () => {

    const [listUsers, setListUser] = useState();
    
    useEffect(() => {
        async function fetchAllUser() {
          const res = await axios.get("http://localhost:8080/users/all")
          const data = res && res.data ? res.data : []
          setListUser(data)
        }
        fetchAllUser()
    }, [])

    const handelDeleteUser = (user) => {
        console.log(user)
    }
  
    return (
        <table className="w-full table-fixed text-left border border-gray-100 rounded">
          <thead>
            <tr>
              {TABLE_HEAD.map((item) => (
                <th key={item} className="border-b border-blue-100 bg-gray-300 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">{item}</Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listUsers && listUsers.length > 0 && listUsers.map((item, index) => {
              const isLast = index === listUsers.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
   
              return (
                <tr key={`user-${index}`}>
                  <td className={classes}>
                    <Typography variant="md" color="blue-gray" className="font-normal">{item.id}</Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="md" color="blue-gray" className="font-normal">{item.username}</Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="md" color="blue-gray" className="font-normal">{item.email}</Typography>
                  </td>
                  <td className={classes}>
                    <button className="bg-blue-300 rounded px-5 py-1 font-semibold text-white">Update</button>
                    <button className="bg-amber-300 rounded px-5 py-1 font-semibold text-white ml-4" onClick={() => handelDeleteUser(item)}>Delete</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
    )
}

export default ListUsersComponent;