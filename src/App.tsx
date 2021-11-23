import { useState } from 'react'
import './App.css'
import { Camera } from './Camera'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Smart Window</h1>
      <Camera onPhoto={(img) => console.log(img)} />
    </div>
  )
}

export default App
