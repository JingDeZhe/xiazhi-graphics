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

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-cw / 2, cw / 2, ch / 2, -ch / 2, 1, 1000)
  camera.position.z = 10

  loadImage('/imgs/3.jpg')
  renderer.setAnimationLoop(animate)
  emitter.on('change-image', loadImage)

  function loadImage(url) {
    const loader = new THREE.TextureLoader()
    loader.load(url, (texture) => {
      texture.magFilter = THREE.LinearFilter
      texture.minFilter = THREE.LinearFilter

      const geometry = new THREE.PlaneGeometry(cw, ch)
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

  function animate() {
    renderer.render(scene, camera)
  }

  window.addEventListener('resize', resize)
  function resize() {
    renderer.setSize(cw, ch)
  }
}

init(window.innerWidth, window.innerHeight)
