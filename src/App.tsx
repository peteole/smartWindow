import { useState } from 'react'
import './App.css'
import { Camera } from './Camera'

function App() {
  const [uploadURL, setUploadURL] = useState("http://" + window.location.hostname + ":8080/upload")

  return (
    <div className="App">
      <h1>Smart Window</h1>
      <Camera onPhoto={(img) => {
        console.log(img)
        const reader = new FileReader()
        reader.onload = async () => {
          const dataURL = reader.result
          const res = await fetch(uploadURL, {
            method: 'POST',
            body: dataURL
          })
          const resp = await res.text()
          alert(resp)
        }
        reader.readAsDataURL(img)
      }} />
      <input type="text" value={uploadURL} onChange={(e) => {
        setUploadURL(e.target.value)
      }} />
    </div>
  )
}

export default App
