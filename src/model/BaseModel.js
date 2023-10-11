// 基类
export class BaseModel{
    constructor(model, scene, camera, control){
        this.scene = scene
        this.model = model
        this.camera = camera
        this.control = control

        this.init() // 调用子类的init方法 // 或者super
    }
     

}