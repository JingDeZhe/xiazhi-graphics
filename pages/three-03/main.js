import './main.css'
import { emitter, config } from './ui'
const app = document.querySelector('#app')

import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { SobelOperatorShader } from 'three/addons/shaders/SobelOperatorShader.js'
import { CopyShader } from 'three/addons/shaders/CopyShader.js'

function init(cw, ch) {
  const renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(cw, ch)
  app.appendChild(renderer.domElement)
  /**@type {THREE.Mesh} */
  let imageMesh
  let imgUrl
  let imgSize

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-cw / 2, cw / 2, ch / 2, -ch / 2, 1, 1000)
  camera.position.z = 10

  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  const edgePass = new ShaderPass(SobelOperatorShader)
  edgePass.uniforms['resolution'].value.x = cw * window.devicePixelRatio
  edgePass.uniforms['resolution'].value.y = ch * window.devicePixelRatio
  const copyPass = new ShaderPass(CopyShader)
  copyPass.renderToScreen = true

  composer.addPass(renderPass)
  composer.addPass(edgePass)
  composer.addPass(copyPass)

  renderer.setAnimationLoop(animate)
  emitter.on('change-image', loadImage)
  loadImage('/imgs/3.jpg')

  function loadImage(url) {
    if (!url) return
    const loader = new THREE.TextureLoader()
    loader.load(url, (texture) => {
      imgUrl = url
      const size = getImageSize(texture.source.data)
      texture.magFilter = THREE.LinearFilter
      texture.minFilter = THREE.LinearFilter
      texture.colorSpace = THREE.SRGBColorSpace

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

      // process()
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
    imgSize = size
    return size
  }

  function process() {
    const gl = renderer.getContext()
    const pixels = new Uint8Array(imgSize.w * imgSize.h * 4)
    gl.readPixels(imgSize.ol, imgSize.ot, imgSize.w, imgSize.h, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
  }

  function animate() {
    if (config.effect) {
      composer.render()
    } else {
      renderer.render(scene, camera)
    }
  }

  window.addEventListener('resize', resize)
  function resize() {
    const { innerWidth: cw, innerHeight: ch } = window
    camera.left = -cw / 2
    camera.right = cw / 2
    camera.top = ch / 2
    camera.bottom = -ch / 2
    camera.updateProjectionMatrix()
    edgePass.uniforms['resolution'].value.x = cw * window.devicePixelRatio
    edgePass.uniforms['resolution'].value.y = ch * window.devicePixelRatio
    renderer.setSize(cw, ch)
    composer.setSize(cw, ch)
  }
}

init(window.innerWidth, window.innerHeight)
