import React, { createContext, useState } from 'react'
export const datacontext = createContext()
import run from '../gemini.jsx';

function UserContext({children}) {
    let [speaking, setSpeaking] = useState(false)
    let [prompt,setprompt]=useState("listening...")

    function speak(text){
        let text_speak = new SpeechSynthesisUtterance(text)
        text_speak.volume = 1;
        text_speak.rate = 1;
        text_speak.pitch = 1;
        text_speak.lang = 'hi-GB'
        window.speechSynthesis.speak(text_speak)
    }

    async function aiResponse(prompt){
        let text = await run(prompt)
        setprompt(text)
        speak(text)
        setTimeout(()=>{
            setSpeaking(false)
        },5000)
        setSpeaking(false)

    }

    // async function aiResponse(prompt) {
    //     try {
    //       let text = await run(prompt);
    //       setprompt(text);
    //       speak(text);
    //     } catch (error) {
    //       console.error("Error getting AI response:", error);
    //       setprompt("Sorry, I couldn't process that request.");
    //     } finally {
    //       setSpeaking(false);
    //     }
    //   }
      

    let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    let recognition = new speechRecognition()
    recognition.onresult = (e) => {
        let currentIndex = e.resultIndex
        let transcript = e.results[currentIndex][0].transcript
        console.log(transcript);
        setprompt(transcript)
        aiResponse(transcript)
    }

    let value = {
        recognition,
        speaking,
        setSpeaking,
        prompt,
        setprompt
    }

    return (
        <div>
            <datacontext.Provider value={value}>
            {children}
            </datacontext.Provider>
        </div>
    )
}

export default UserContext
