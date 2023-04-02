const { TTS_API_KEY, TTS_URL, TTS_TOKEN } = require('../env-variables.json')

const textToSpeech = async (text) => {
  const url = `${TTS_URL}/?key=${TTS_TOKEN}`
  const lang = 'es-MX'
  const rate = '1.2'
  const codec = 'wav'
  const voice = 'Silvia'
  const format = '44khz_16bit_stereo'

  const encodedParams = new URLSearchParams()
  encodedParams.append('src', text)
  encodedParams.append('hl', lang)
  encodedParams.append('r', rate)
  encodedParams.append('c', codec)
  encodedParams.append('v', voice)
  encodedParams.append('f', format)

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': TTS_API_KEY,
      'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com'
    },
    body: encodedParams
  }

  const response = await fetch(url, options)

  const result = await response.blob()

  return result
}

module.exports = {
  textToSpeech
}
