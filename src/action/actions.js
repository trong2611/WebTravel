import axios from "axios";
import { INCREMENT, DECREMENT, DELETE_USER_SUCCESS } from "./types";
import { FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_ERROR,  
         CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_ERROR,
} from "./types";

export const increaseCounter = () => {
    return {
        type: INCREMENT,
        // payload: ... nếu có 
    }
}

export const decreaseCounter = () => {
    return {
        type: DECREMENT,
    }
}

export const fetchAllUsers = () => {
    return async (dispatch, getState) => {
        dispatch(fetchUserRequest())
        try {
            const res = await axios.get("http://localhost:8080/users/all")
            const data = res && res.data ? res.data : []
            dispatch(fetchUserSuccess(data))
        } catch (error) {
            console.log(error);
            dispatch(fetchUserError())
        }
    }
}

export const createNewUser = (email, password, username) => {
    return async (dispatch, getState) => {
        dispatch(createUserRequest())
        try {
            const res = await axios.post("http://localhost:8080/users/create", {email, password, username})
            if(res && res.data.errCode === 0 ) {
                dispatch(createUserSuccess())
                dispatch(fetchAllUsers())
            }
        } catch (error) {
            console.log(error);
            dispatch(createUserError())
        }
    }
}

export const deleteUser = (id) => {
    return async(dispatch, getState) => {
        try {
            const res = await axios.post(`http://localhost:8080/users/delete/${id}`)
            if(res && res.data.errCode === 0 ) {
                dispatch(deleteUserSuccess())
                dispatch(fetchAllUsers())
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const fetchUserRequest = () => {
    return {
        type: FETCH_USER_REQUEST,
    }
}

export const fetchUserSuccess = (payload) => {
    return {
        type: FETCH_USER_SUCCESS,
        payload: payload,
    }
}

export const fetchUserError = () => {
    return {
        type: FETCH_USER_ERROR,
    }
}

export const createUserRequest = () => {
    return {
        type: CREATE_USER_REQUEST,
    }
}

export const createUserSuccess = () => {
    return {
        type: CREATE_USER_SUCCESS,
    }
}

export const createUserError = () => {
    return {
        type: CREATE_USER_ERROR,
    }
}

export const deleteUserSuccess = () => {
    return {
        type: DELETE_USER_SUCCESS,
    }
}

