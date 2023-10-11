// 火灾影响范围-球体标记类
import * as THREE from 'three'
export class FireBall {
  constructor(scene, center) {
    this.scene = scene
    this.center = center

    this.nowMesh = {} // 半球体对象
    this.nowScale = 0 // 当前放大的比例(0-1)

    this.init()
  }
  init() {
    // 半球体物体
    const geometry = new THREE.SphereGeometry(
      25,
      32,
      16,
      0,
      Math.PI * 2, // 水平方向扫描角度
      0,
      Math.PI / 2, // 垂直方向扫描角度（一半）-半球体
    )
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#f4790d'),
      side: THREE.DoubleSide,
      depthTest: false // 关闭深度测试（透视效果）- 多个像素点同时渲染
    })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(this.center.x, 0, this.center.z)
    this.scene.add(sphere)
    this.nowMesh = sphere
    this.nowMesh.scale.set(0, 0, 0) // 缩小成不显示，后续做动效再出现
  }
  clear() {
    this.nowMesh.geometry.dispose()
    this.nowMesh.material.dispose()
    this.scene.remove(this.nowMesh)
  }
  // 动效
  onTick() {
    if (this.nowScale < 0.5) {
      this.nowScale += 0.001 // 增加放大的比例
      this.nowMesh.scale.set(this.nowScale, this.nowScale, this.nowScale)
    } else {
      this.nowScale = 0
    }
  }
}