import * as THREE from 'three'

/**
 * 获取模型中心点和高度差
 * @param {*} mesh 目标模型对象
 * @returns { center: 中心点坐标, uHeight: 高度差值 }
 */
export const getBoxCenter = mesh => {
  let box = new THREE.Box3()
  // expandByObject：包裹在包围盒中的3d对象
  box.expandByObject(mesh)
  // 计算包围盒的中心点三维坐标对象
  let center = new THREE.Vector3()
  box.getCenter(center)

  // 计算物体宽，高，深（x，y，z）的值
  var size = new THREE.Vector3()
  box.getSize(size)

  return {
    center,
    size
  }
}