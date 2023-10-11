import { BaseModel } from "./BaseModel";
import * as THREE from 'three'
import { EdgesLine } from "@/effect/EdgesLine";
import { modifyCityDefaultMaterial } from '@/shader/modifyCityMaterial'
import { BuildInfo } from "@/dom/BuildInfo";

// 光线投射类
import { ClickHandler } from "@/utils/ClickHandler";

// 水面效果
import { CityWater } from '@/effect/CityWater'
import { Fire } from "@/effect/Fire";
import { FireBall } from "@/effect/FireBall";
import { getBoxCenter } from "@/utils/getBoxCenter";
import { EffectManager } from "@/effect/EffectManager";

export class City extends BaseModel{
    init(){
        this.scene.add(this.model)
        this.initeffect()
        // 动态火灾标记
        // this.initFire('01-shanghaizhongxindasha')

        this.buildNameObj = { // 模型名字和建筑显示名字对应关系
            '01-shanghaizhongxindasha': '上海中心大厦',
            "02-huanqiujinrongzhongxin": "环球金融中心",
            "03-jinmaodasha": "金茂大厦",
            "04-dongfangmingzhu": "东方明珠",
        }
        this.bindClick()
    }
    initeffect(){
        // 中心城市建筑材质
        const centerMaterial = new THREE.MeshBasicMaterial({
            color: 0xA8CDED,
            transparent: true // 透明度
        })
        // 外围城市建筑材质
        const periphery = new THREE.MeshBasicMaterial({
            color: 0xA8CDED,
            transparent: true
        })

        // 初始化城市效果
        this.model.traverse((model)=>{
            // 遍历每一个小的模型对象
            if (model.name === 'Text') {
                // 隐藏默认建筑名字
                model.visible = false
                return
            }
            // 排除地板和河水物体
            if (model.name !== 'Shanghai-09-Floor' && model.name !== 'Shanghai-08-River') {
                // 修改城市建筑模型材质
                if (model.name == 'Shanghai-02' || model.name == 'Shanghai-03' || model.name == 'Shanghai-04' || model.name == 'Shanghai-05' || model.name == 'Shanghai-06' || model.name == 'Shanghai-07') {
                    // 周围建筑
                    model.material = periphery
                    new EdgesLine(this.scene, model, new THREE.Color('#666666'))
                    // 对物体追加混合的着色器代码（渐变色白膜效果）
                    modifyCityDefaultMaterial(model, false)
                } else {
                    // 中心建筑
                    model.material = centerMaterial
                    new EdgesLine(this.scene, model, new THREE.Color('#00ffff'))
                    modifyCityDefaultMaterial(model, true)
                }
            }
            // 针对水物体单独处理
            if (model.name === 'Shanghai-08-River') {
                // 把原本水物体隐藏
                model.visible = false
                // 创建更加真实的水面效果物体
                const theWater = new CityWater(model, this.scene)
                // 把水波纹物体传入到动效管理类当中
                EffectManager.getInstance().addObj(theWater)
            }

        })
        
    }
    // 初始化火灾标记
    initFire(buildName) {
        const build = this.model.getObjectByName(buildName)
        const { center, size } = getBoxCenter(build)
    
        const fire = new Fire(this.scene, center, size)
        const ball = new FireBall(this.scene, center)
        // 注册动效管理
        EffectManager.getInstance().addObj(ball)
        // 过了 15 秒以后清除标记
        setTimeout(() => {
            fire.clear()
            ball.clear()
    
            // 移除动效
            EffectManager.getInstance().removeObj(ball)
        }, 15000)
    }
    // 中心四个建筑绑定点击事件
    bindClick(){
        Object.keys(this.buildNameObj).forEach((key)=>{
            const build = this.model.getObjectByName(key)
            ClickHandler.getInstance().addMesh(build,(object)=>{
                // object:3d物体
                const { center, size } = getBoxCenter(object)
                new BuildInfo(this.scene, center, this.dataObj.buildingsIntroduce[object.name])
            })
        })
    }
}