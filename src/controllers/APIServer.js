/* global fetch, FormData */

const POLLING_INTERVAL = 1000
const POLLING_MAX_ATTEMPTS = 30
const api = (endpoint = '') => 'https://api.tooooools.com/' + endpoint

// Polling abstraction which will try to ping the API server until either the
// version is returned or the max attempts is reached
const polling = {
  timer: null,
  attempts: 0,
  start: function () {
    this.stop()
    if (this.attempts >= POLLING_MAX_ATTEMPTS) {
      console.warn('APIServer max polling attempts reached')
      return
    }

    this.timer = setTimeout(async () => {
      this.attempts++
      try {
        const ping = await fetch(api('ping'), { method: 'GET' })
        const response = await ping.json()
        if (!response || !response.version) throw new Error('Ping malformed')

        console.info(`Connected to tooooools-api@${response.version}`)
      } catch (error) {
        this.start()
      }
    }, POLLING_INTERVAL)
  },

  stop: function () {
    clearTimeout(this.timer)
  }
}

export default {
  polling,
  pdf: async ({
    svgString,
    files = {}, // { 'filename': <blob>, … }
    pdfOptions = {}
  } = {}) => {
    const body = new FormData()

    for (const filename in files) {
      body.append(filename, files[filename], filename)
    }

    body.append('svg', svgString)
    body.append('options', JSON.stringify(pdfOptions))

    const response = await fetch(api('pdf'), {
      method: 'POST',
      headers: {
        // IMPORTANT: multipart/form-data POST won't work with the Fetch API if
        // the 'Content-Type' header is explicitly set: it must be left
        // undefined so that the right 'boundary=' value can be added. WTF
        // SEE https://stackoverflow.com/a/39281156
      },
      body
    })

    const location = api() + response.headers.get('Location')

    if (!response.ok) {
      console.error(response)
      throw new Error(response.status + ': ' + response.statusText)
    }
    return { response, location }
  }
}
