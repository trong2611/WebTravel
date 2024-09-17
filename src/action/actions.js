import { INCREMENT, DECREMENT } from "./types";

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