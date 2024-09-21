import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react"
import { deleteUser, fetchAllUsers } from "../action/actions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TABLE_HEAD = ["Id", "Username", "Email", "Action"];
 
const ListUsersComponent = () => {

    const dispatch = useDispatch()
    const listUsers = useSelector((state) => state.userReducer.listUsers)
    const isLoading = useSelector((state) => state.userReducer.isLoading)
    const isError = useSelector((state) => state.userReducer.isError)

    useEffect(() => {
      dispatch(fetchAllUsers())
    }, [])

    const handelUpdateUser = (user) => {
      console.log(user)
    }

    const handelDeleteUser = (id) => {
      dispatch(deleteUser(id))
      toast(`Delete user id: ${id} successfully!`)
    }

    // nếu muốn code tường minh hơn thì nên dùng if elfe rồi return component  
    return (
        <table className="w-full table-fixed text-left border border-gray-100 rounded overflow-y">
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
            {
              isError === true ? 
              <tr>
                <td>Somthing wrongs, please try again...</td>
              </tr>
              :
              <>
                {isLoading === true ?
                  <tr>
                    <td>Loading data...</td>
                  </tr>
                  :
                  <>
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
                          <button className="bg-blue-300 rounded px-5 py-1 font-semibold text-white" onClick={() => handelUpdateUser(item) }>Update</button>
                          <button className="bg-amber-300 rounded px-5 py-1 font-semibold text-white ml-4" onClick={() => handelDeleteUser(item.id)}>Delete</button>
                        </td>
                      </tr>
                    )
                    })}
                  </>
                }
                
              </>
            }
            
          </tbody>
        </table>
    )
}

export default ListUsersComponent;