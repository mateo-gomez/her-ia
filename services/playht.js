const {
  PLAYHT_API_KEY,
  PLAYHT_USER_ID,
  PLAYHT_URL
} = require('../env-variables.json')

const { pol } = require('../utils')

const ttsGenerate = async (text) => {
  const url = `${PLAYHT_URL}/convert`
  const USER_ID = PLAYHT_USER_ID
  const voiceId = 'es-CO-SalomeNeural'
  const content = [text]

  console.log('text to speech generate...')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: PLAYHT_API_KEY,
      'X-User-ID': USER_ID,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      voice: voiceId,
      content
    })
  })

  return response.json()
}

const ttsStatus = async (transcription) => {
  const params = new URLSearchParams({ transcriptionId: transcription })
  const url = `${PLAYHT_URL}/articleStatus?${params.toString()}`
  const USER_ID = PLAYHT_USER_ID

  const response = await fetch(url, {
    headers: {
      Authorization: PLAYHT_API_KEY,
      'X-User-ID': USER_ID,
      'Content-Type': 'application/json'
    }
  })

  return response.json()
}

const textToSpeechIA = async (ev, text) => {
  const { transcriptionId } = await ttsGenerate(text)
  const result = await pol(
    async () => ttsStatus(transcriptionId),
    (res) => res.converted
  )

  return result
}

module.exports = {
  textToSpeechIA
}
