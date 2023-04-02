const SpaceBarCode = 'Space'
const $ = (selector) => document.querySelector(selector)

const textFeedback = $('.text-feedback')

const previousConversations = []

if (navigator.mediaDevices) {
  console.log('getUserMedia supported!')

  const constraints = { audio: true }
  let chunks = []

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const mediaRecorder = new window.MediaRecorder(stream)

      document.addEventListener('keydown', (ev) => {
        if (ev.code === SpaceBarCode && mediaRecorder.state === 'inactive') {
          textFeedback.innerText = 'Listening...'
          mediaRecorder.start()
        }
      })

      document.addEventListener('keyup', (ev) => {
        if (ev.code === SpaceBarCode && mediaRecorder.state === 'recording') {
          mediaRecorder.stop()
        }
      })

      mediaRecorder.ondataavailable = (ev) => {
        chunks.push(ev.data)
      }

      mediaRecorder.onstop = async (ev) => {
        console.log('processing audio...')

        textFeedback.innerText = 'Processing...'

        const blob = new window.Blob(chunks, { type: 'audio/webm' })
        const binaryAudio = await blob.arrayBuffer()

        chunks = []

        try {
          const { text: whisperText, error: whisperError } =
            await window.electronAPI.whisper(binaryAudio)

          console.log('whisper result', whisperText)

          if (whisperError) {
            throw new Error(whisperError.message)
          }

          const { choices, error: gptError } = await window.electronAPI.askGPT(
            whisperText,
            previousConversations
          )

          if (gptError) {
            throw new Error(gptError.message)
          }

          if (!choices || !choices.length) {
            throw new Error('No response')
          }

          const iaMessage = choices[0].message

          console.log('ia response', iaMessage)

          previousConversations.push(iaMessage)

          // BASICO
          // const speechBlob = await textToSpeech(text)
          // console.log('spechread', speechBlob)
          // const speechUrl = URL.createObjectURL(speechBlob)

          // CON IA
          const speechResult = await window.electronAPI.textToSpeechIA(
            iaMessage.content
          )

          console.log('spechread', speechResult)

          const audioSpeech = new window.Audio(speechResult.audioUrl)
          await audioSpeech.play()
        } catch (error) {
          window.alert(error.message)
        }

        textFeedback.innerText = "Press 'Space' to talk"
      }
    })
    .catch((e) => {
      console.error(`Ocurrieron algunos errores: ${e}`)
    })
}
