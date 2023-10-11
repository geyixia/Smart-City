// 火灾标记类
import * as THREE from 'three'

export class Fire{
    constructor(scene, center, size){
        this.scene = scene
        this.center = center // 建筑中心点的三维向量
        this.size = size //建筑物大小的三维向量对象
        this.init()
    }
    init(){
        const texture = new THREE.TextureLoader().load('icon/fire.png')
        texture.colorSpace = THREE.SRGBColorSpace
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture
        })
        const sprite = new THREE.Sprite(spriteMaterial)
        // +3 让精灵物体中心点不在建筑物顶点，再往上移动一些单位
        sprite.position.set(this.center.x, this.center.y + this.size.y / 2 + 3, this.center.z)
        
        sprite.scale.set(10, 10, 10)
        this.scene.add(sprite)

        this.model = sprite
    }
    clear() {
        this.scene.remove(this.model)
    }
    
}