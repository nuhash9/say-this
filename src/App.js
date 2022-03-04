import { useState, useEffect } from 'react'
import './App.css'

// key will be present only on the Cloud Function
// const KEY = process.env.REACT_APP_GOOGLE_TTS_API_KEY

const getAudio = "https://us-central1-pristine-rock-342922.cloudfunctions.net/getAudio"


function App() {
  const [word, setWord] = useState("")
  const [wordShown, setWordShown] = useState("")
  // const [audioStream, setAudioStream] = useState(null)
  const [sound, setSound] = useState(null);

  const handleClick = async () => {
    if (word) {
      console.log("in handleClick with word")

      // create request body for fetch
      const req = {
        "input": {
          "text": word
        },
        "voice": {
          "languageCode": "en-US",
          "name": "en-US-Wavenet-F"
        },
        "audioConfig": {
          "audioEncoding": "MP3"
        }
      }

      const audioContent = await fetch(getAudio, {
        method: "POST",
        mode: "cors",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(req)
      })

      const rawSound = await audioContent.text()
      setSound(new Audio("data:audio/mpeg;base64," + rawSound))
      // console.log(rawSound)

      clearForm()
    }
    // play sound if loaded already and button is pressed without a new word
    else if (sound) {
      console.log("in handleClick with sound")
      sound.play()
    }
  }

  // useEffect(() => {
  //   if (audioStream) {
  //     const sound = new Audio("data:audio/mpeg;base64," + audioStream.audioContent)
  //     setSound(sound)
  //   }
  // }, [audioStream])

  useEffect(() => {
    if (sound) {
      sound.play()
    }
  }, [sound])

  const clearForm = () => {
    setWord("")
  }

  return (
    <div className="App">
      <main className='flex flex-col items-center justify-center gap-4 p-4'>
        <div className="px-10 py-8 shadow-md rounded-md bg-gray-50">
          <h3 className='text-3xl uppercase font-["bebas_neue"] border-b-2 border-b-yellow-300'> {wordShown ? wordShown : "Say This"}</h3>
        </div>
        <input className='border-2 rounded-md py-2 px-4 mt-8' 
          onChange={(e) => {
            setWord(e.target.value)
            setWordShown(e.target.value)
          }}
          type="text" name="word" value={word}
        />
        <button className='px-5 py-2 text-white bg-red-400 rounded-full hover:bg-red-500 hover:shadow-inner'
          onClick={handleClick}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
        </button>
      </main>
    </div>
  )
}

export default App
