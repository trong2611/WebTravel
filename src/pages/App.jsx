import React, { useEffect } from 'react'
import Header from '../components/Header/Header.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import { Navigate, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

function App() {

    const user = useSelector(state => state.user.user)
    return (
        user && user !== null 
        ? 
            <>
                <Header/>
                <Outlet/>
            </>
        :
            <Navigate to="/login" />
    )

}

export default App;
