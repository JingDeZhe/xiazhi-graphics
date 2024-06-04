import './main.css'
const app = document.querySelector('#app')

import * as THREE from 'three'

function init(cw, ch) {
  const renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(cw, ch)
  app.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-cw / 2, cw / 2, ch / 2, -ch / 2, 1, 1000)
  camera.position.z = 10

  const loader = new THREE.TextureLoader()
  loader.load('/imgs/3.jpg', (texture) => {
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearFilter

    const geometry = new THREE.PlaneGeometry(cw, ch)
    const materal = new THREE.MeshBasicMaterial({
      map: texture,
    })
    const imageMesh = new THREE.Mesh(geometry, materal)
    scene.add(imageMesh)
  })

  function animate() {
    renderer.render(scene, camera)
  }
  renderer.setAnimationLoop(animate)

  window.addEventListener('resize', resize)
  function resize() {
    renderer.setSize(cw, ch)
  }
}

init(window.innerWidth, window.innerHeight)
