import './main.css'
import { emitter } from './ui'
const app = document.querySelector('#app')

import * as THREE from 'three'

function init(cw, ch) {
  const renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(cw, ch)
  app.appendChild(renderer.domElement)
  /**@type {THREE.Mesh} */
  let imageMesh
  let imgUrl

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-cw / 2, cw / 2, ch / 2, -ch / 2, 1, 1000)
  camera.position.z = 10

  loadImage('/imgs/3.jpg')
  renderer.setAnimationLoop(animate)
  emitter.on('change-image', loadImage)

  function loadImage(url) {
    if (!url) return
    const loader = new THREE.TextureLoader()
    loader.load(url, (texture) => {
      imgUrl = url
      const size = getImageSize(texture.source.data)
      texture.magFilter = THREE.LinearFilter
      texture.minFilter = THREE.LinearFilter

      const geometry = new THREE.PlaneGeometry(size.w, size.h)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
      })
      if (imageMesh) {
        imageMesh.material = material
      } else {
        imageMesh = new THREE.Mesh(geometry, material)
        scene.add(imageMesh)
      }
    })
  }

  function getImageSize(img) {
    const { width: iw, height: ih } = img
    const { clientWidth: rw, clientHeight: rh } = renderer.domElement

    const size = {}
    if (iw / ih > rw / rh) {
      size.w = rw
      size.h = rw * (ih / iw)
      size.ot = (rh - size.h) / 2
    } else {
      size.h = rh
      size.w = rh * (iw / ih)
      size.ol = (rw - size.w) / 2
    }
    return size
  }

  function animate() {
    renderer.render(scene, camera)
  }

  window.addEventListener('resize', resize)
  function resize() {
    const { innerWidth: cw, innerHeight: ch } = window
    camera.left = -cw / 2
    camera.right = cw / 2
    camera.top = ch / 2
    camera.bottom = -ch / 2
    camera.updateProjectionMatrix()
    renderer.setSize(cw, ch)
  }
}

init(window.innerWidth, window.innerHeight)
