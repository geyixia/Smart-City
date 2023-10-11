// 2D 物体 - 建筑信息
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
export class BuildInfo {
  constructor(scene, center, dataObj) {
    this.scene = scene
    this.center = center
    this.dataObj = dataObj

    this.list = [] // 保存名字和信息的 2 个 2D 物体

    this.createNameDiv()
    this.createInfoDiv()
  }
  // 建筑名字的 2D 物体
  createNameDiv() {
    const nameDiv = document.querySelector('#tag-1')
    nameDiv.innerHTML = this.dataObj.name // 建筑名字
    // 标签虽然有 display:none, 转化成2d物体后会在页面直接显示
    const nameObject = new CSS2DObject(nameDiv)
    nameObject.position.set(this.center.x, this.center.y + 10, this.center.z)
    this.scene.add(nameObject)
    this.list.push(nameObject)
  }
  // 建筑信息的 2D 物体
  createInfoDiv() {
    const infoDiv = document.querySelector('#tag-2')
    infoDiv.style.pointerEvents = 'all'
    const { squareMeters, accommodate, officesRemain, parkingRemain } = this.dataObj
    const textHtml = `
    <div>总平米数： ${squareMeters}</div>
    <div>容纳人数： ${accommodate}</div>
    <div>可出租位： ${officesRemain}</div>
    <div>空余车位： ${parkingRemain}</div>
      `
    infoDiv.innerHTML = textHtml

    const infoObject = new CSS2DObject(infoDiv)
    infoObject.position.set(this.center.x, this.center.y + 5, this.center.z)
    this.scene.add(infoObject)
    this.list.push(infoObject)

    // DOM 点击事件 => 隐藏此建筑物的信息标签
    infoDiv.addEventListener('click', (e) => {
      e.stopPropagation()
      this.clear.call(this)
    })
  }
  // 隐藏信息物体
  clear() {
    this.list.forEach(obj => obj.visible = false)
  }
}