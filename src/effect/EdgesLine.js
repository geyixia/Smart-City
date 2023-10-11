// 边缘几何体
import * as THREE from 'three'
// 给city小的物体添加边线效果
export class EdgesLine {
    constructor(sence, mesh, color){
        this.sence = sence
        this.color = color
        this.mesh = mesh // 小物体对象
        this.init()
    }
    init(){
        const edgesGeo = new THREE.EdgesGeometry(this.mesh.geometry)
        // 几何体对象 线段材质
        const line = new THREE.LineSegments(edgesGeo, new THREE.LineBasicMaterial({
            color: this.color
        }))
        // 每个传进来的小的模型对象的 位置 旋转角度 缩放 赋予给变现物体
        line.position.copy(this.mesh.position)
        line.rotation.copy(this.mesh.rotation)
        line.scale.copy(this.mesh.scale)
        this.sence.add(line)
    }
}