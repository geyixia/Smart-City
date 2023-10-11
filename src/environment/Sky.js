// 天空背景类
import * as THREE from 'three'
export class Sky {
  constructor(scene) {
    this.scene = scene
  }
  // 创建并设置天空背景
  setBack(publicPath, pathList) {
    (new THREE.CubeTextureLoader()).setPath(publicPath).load(pathList, (texture) => {
      this.scene.background = texture
    })
  }
}