import { connect } from "react-redux"
import { increaseCounter, decreaseCounter } from "../action/actions"

function App(props) {

  const handleIncrease = () => {
    props.increaseCounter()
  }

  const handleDecrease = () => {
    props.decreaseCounter()
  }

  return (
    <div className="flex-col flex w-full h-full justify-items-center place-items-center mt-5">
      <div className="m-4 pt-2 pb-2 pl-4 pr-4 rounded font-semibold text-cyan-600 bg-orange-300">Count: {props.count}</div>
      <button className="pt-2 pb-2 pl-4 pr-4 rounded font-semibold text-cyan-600" onClick={() => handleIncrease()}>Increase Count</button>
      <button className="pt-2 pb-2 pl-4 pr-4 rounded font-semibold text-cyan-600" onClick={() => handleDecrease()}>Decrease Count</button>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    count: state.counter.count,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    increaseCounter: () => dispatch(increaseCounter()),
    decreaseCounter: () => dispatch(decreaseCounter()),
  } 
}

export default connect(mapStateToProps,mapDispatchToProps)(App)
