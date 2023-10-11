// 游船类
import * as THREE from 'three'
import { BaseModel } from './BaseModel'
import { EventBus } from '@/utils/EventBus';

export class Ship extends BaseModel {
  init() {
    this.scene.add(this.model)
    this.pointIndex = 0 // 保存当前游船所在坐标索引
    this.generatorMovePath()

    this.isMoveCamera = false // 开关属性（控制摄像机是否跟随游船移动）
    this.onModelAttach() // 鼠标事件
  }
  // 生成游船行进的路线坐标集合点
  generatorMovePath(){
    // 设置平滑的三维样条曲线路线坐标点，CatmullRomCurve3
    // 设置关键的几个点坐标，其他的构造函数内会帮我们计算
    const shipPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(134.356097129589, 2.0112688541412354, -78.91746888546072),
      new THREE.Vector3(13.132075955743915, 2.0112688541412425, -69.85260460470285),
      new THREE.Vector3(13.132075955743915, 2.0112688541412425, -69.85260460470285),
      new THREE.Vector3(-80.28995611104816, 2.0112688541412282, -12.640254617216172),
      new THREE.Vector3(-71.5470123066941, 2.0112688541412354, 25.641138454485144),
      new THREE.Vector3(-71.5470123066941, 2.0112688541412354, 25.641138454485144),
      new THREE.Vector3(-17.5179164111899, 2.0112688541412354, 139.95062075065943),
      new THREE.Vector3(-67.10547001341894, 2.0112688541412354, 64.30494908329582),
      new THREE.Vector3(-87.03568940230136, 2.0112688541412354, 20.40776369519459),
      new THREE.Vector3(-88.0509634357777, 2.0112688541412425, -32.429601593890354),
      new THREE.Vector3(-70.27457116256328, 2.0112688541412425, -50.370253013515836),
      new THREE.Vector3(-39.206573479212764, 2.0112688541412425, -64.28841112963838),
      new THREE.Vector3(47.33347662423566, 2.0112688541412354, -73.13885409538068),
      new THREE.Vector3(134.356097129589, 2.0112688541412354, -78.91746888546072),
    ])
    // shipPath 路径 getSpacedPoints得到等间距的坐标点
    this.pointArr = shipPath.getSpacedPoints(3500) // 点越多速度越慢

    // 坐标点转换成几何图形 线段物体显示一下
    const geometry = new THREE.BufferGeometry().setFromPoints(this.pointArr)
    const material = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide
    })
    const line = new THREE.Line(geometry, material)
    this.scene.add(line)
  }
  // 游船行进的方法
  onTick(){
    if (this.pointIndex < this.pointArr.length - 1) {
      const { x, y, z } = this.pointArr[this.pointIndex + 1]
      if (this.isMoveCamera) { // 移动摄像机
        if (!this.isMouseTouching) { // 鼠标没有被按下时，才设置摄像机的 lookAt
          // 如果处于漫游模式+鼠标被按下，证明自己要旋转摄像机，那就不能让摄像的 lookAt 执行影响旋转效果
          this.camera.lookAt(x, y + 20, z)
        }
       
        this.camera.position.set(x, y + 20, z)
      }
      // 取出坐标设置给模型对象
      this.model.position.copy(this.pointArr[this.pointIndex])
      // 确保船头朝向下一个坐标位置
      this.model.lookAt(this.pointArr[this.pointIndex + 1])
      this.pointIndex += 1
    }else{
      this.pointIndex = 0
    }
  }

  // 鼠标按下
  mousedownFn = () => {
    this.isMouseTouching = true // 鼠标已经按下
  }
  // 鼠标移动
  mousemoveFn = (e) => {
    if (this.isMouseTouching) { // 只有按下时进入此逻辑代码
      // 旋转核心思想：在原有的旋转角度基础上，新增移动的偏移量，乘以 0.01 让旋转弧度降低
      // rotateY() 在上一次旋转的角度上继续新增你传入的弧度数值
      // rotation.y = 直接赋予一个旋转的最终弧度数值
      console.log(1)
      this.camera.rotateY((this.prePos - e.clientX) * 0.01)
    }

    this.prePos = e.clientX
  }
  // 鼠标抬起
  mouseupFn = () => {
    this.isMouseTouching = false
    this.prePos = undefined // 清空上一次记录的坐标点位置
  }
  // 绑定/移除鼠标事件
  onModelAttach() {
    // 点击漫游模式 - 绑定/移除鼠标相关事件
    EventBus.getInstance().on('mode-roaming', isOpen => {
      if (isOpen) {
        window.addEventListener('mousedown', this.mousedownFn)
        window.addEventListener('mousemove', this.mousemoveFn)
        window.addEventListener('mouseup', this.mouseupFn)
      } else {
        window.removeEventListener('mousedown', this.mousedownFn)
        window.removeEventListener('mousemove', this.mousemoveFn)
        window.removeEventListener('mouseup', this.mouseupFn)
      }
    })
  }
}