/* global atob, Blob, FileReader, Image, XMLHttpRequest */

const Convert = {
  blob: blob => ({
    toDataURL: () => new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target.result)
      reader.readAsDataURL(blob)
    }),

    toObjectURL: () => URL.createObjectURL(blob),

    toImage: async () => {
      const objectURL = Convert.blob(blob).toObjectURL()
      return Convert.objectURL(objectURL).toImage()
    }
  }),

  dataURL: dataURL => ({
    toBlob: () => {
      const arr = dataURL.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }

      return new Blob([u8arr], { type: mime })
    },

    toObjectURL: async () => {
      const blob = await Convert.dataURL(dataURL).toBlob()
      return Convert.blob(blob).toObjectURL()
    }
  }),

  objectURL: objectURL => ({
    toBlob: () => new Promise(resolve => {
      const request = new XMLHttpRequest()
      request.open('GET', objectURL, true)
      request.responseType = 'blob'
      request.onload = () => resolve(request.response)
      request.send()
    }),

    toDataURL: async () => {
      const blob = await Convert.objectURL(objectURL).toBlob()
      return Convert.blob(blob).toDataURL()
    },

    toImage: () => new Promise((resolve, reject) => {
      const image = new Image()
      image.error = reject
      image.onload = () => resolve(image)
      image.src = objectURL
    })
  })
}

export default Convert
