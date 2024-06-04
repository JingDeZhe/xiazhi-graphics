import GUI from 'lil-gui'
import mitt from 'mitt'
const gui = new GUI()
export const emitter = mitt()

const fileInput = document.createElement('input')
fileInput.type = 'file'
fileInput.accept = 'image/*'
fileInput.hidden = 'true'
document.body.appendChild(fileInput)
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0]
  if (!file) return
  readFileAsUrl(file, (url) => {
    emitter.emit('change-image', url)
  })
})
export const config = {
  uploadImage: () => {
    fileInput.click()
  },
  effect: false,
}

gui.add(config, 'uploadImage').name('Change image')
gui.add(config, 'effect').name('Enable effect')

function readFileAsUrl(file, cb) {
  if (!file || !cb) return
  const reader = new FileReader()
  reader.onloadend = () => {
    cb(reader.result)
  }
  reader.readAsDataURL(file)
}
