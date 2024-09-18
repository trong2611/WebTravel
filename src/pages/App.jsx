import { connect } from "react-redux"
import { increaseCounter, decreaseCounter } from "../action/actions"
import { useSelector, useDispatch } from "react-redux"

import Home from "../components/Home.jsx"

function App() {

  return (
    <Home/>
  )

}

export default App;



  // const dispatch = useDispatch()

  // const newCount = useSelector(
  //   (state) => {
  //     return state.counterReducer.count
  //   }
  // )

  // const handleIncrease = () => {
  //   dispatch(increaseCounter())
  // }

  // const handleDecrease = () => {
  //   dispatch(decreaseCounter())
  // }


// const newCount = useSelector( // nên chia nhỏ biến ra để đúng với các hook ----- (state) => state.counterReducer viết tắt với return 1 biến
//     (state) => {
//       return state.counterReducer.count
//     }
//   )

//   const handleIncrease = () => {// props.increaseCounter()
//     dispatch(increaseCounter())
//   }

//   const handleDecrease = () => {// props.decreaseCounter()
//     dispatch(decreaseCounter())
//   }

// const mapStateToProps = state => {
//   return {
//     count: state.counterReducer.count,
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     increaseCounter: () => dispatch(increaseCounter()),
//     decreaseCounter: () => dispatch(decreaseCounter()),
//   } 
// }

// export default connect(mapStateToProps,mapDispatchToProps)(App)