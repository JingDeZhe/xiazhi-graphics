import './main.css'
import GUI from 'lil-gui'
const gui = new GUI()

const fileInput = document.createElement('input')
fileInput.type = 'file'
fileInput.accept = 'image/*'
fileInput.hidden = 'true'
document.body.appendChild(fileInput)
const coverImg = document.createElement('img')
coverImg.style = 'width:50vw;display:block;'
document.body.appendChild(coverImg)
let fileChangeInfo = {}
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (fileChangeInfo?.type === 'cover') {
    readFileAsUrl(file, (url) => {
      coverImg.src = url
    })
  }
})

function readFileAsUrl(file, cb) {
  if (!file || !cb) return
  const reader = new FileReader()
  reader.onloadend = () => {
    cb(reader.result)
  }
  reader.readAsDataURL(file)
}

const config = {
  title: '',
  category: 'book',
  theme: '#d63838',
  cover: () => {
    fileChangeInfo = { type: 'cover' }
    fileInput.click()
  },
  count: 1,
  readonly: false,
  info: () => {
    console.log('lil demo')
  },
}

gui.add(config, 'info')
gui.add(config, 'title')
gui.add(config, 'cover')
gui.add(config, 'category', ['book', 'paper', 'movie'])
gui.addColor(config, 'theme')
gui.add(config, 'count', 0, 100, 1)

const advanced = gui.addFolder('Advanced')
advanced.add(config, 'readonly', 0, 100, 1)

gui.onChange((e) => {
  console.log(e)
})
