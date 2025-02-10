import React, { useContext, useState } from 'react'
import "./App.css"
import { GiAtomicSlashes } from "react-icons/gi";
import speakimg from "./assets/va.gif";
import { datacontext } from './context/UserContext';

function App() {
  let {recognition,speaking,setSpeaking,prompt,setprompt}=useContext(datacontext)

  return (
    <div className='main'>
      <span>
        I am Aesir.
      </span> 
      {!speaking? 
      <button onClick={()=>{
    setprompt("listening...")
    setSpeaking(true)
  recognition.start()
      }}>
        Click here <GiAtomicSlashes /></button>
    :
    <div className='response'>
<img src={speakimg} alt="" id="speak"/> 
<p>{prompt}</p>   
    </div>

    }  
    </div>
  )
}

export default App

