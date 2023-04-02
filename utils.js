const pol = async (fn, validate, interval = 300, maxAttempts = 10) => {
  let attempts = 0

  const executePol = async (resolve, reject) => {
    const result = await fn()
    attempts++

    if (validate(result)) {
      resolve(result)
    } else if (maxAttempts && attempts === maxAttempts) {
      reject(
        new Error(
          'Intentos máximos excedido al validar estado de transcripción'
        )
      )
    } else {
      setTimeout(executePol, interval, resolve, reject)
    }
  }

  return new Promise(executePol)
}

module.exports = {
  pol
}
