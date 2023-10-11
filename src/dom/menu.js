import { EventBus } from '@/utils/EventBus';

// 右上角 2 个按钮
let modeArr = [
  {
    mode: 'mode-topView', // id 名字，也作为 EventBus 中自定义事件名字
    isOpen: false // 当前按钮状态-true开始，false关闭中
  },
  {
    mode: 'mode-roaming',
    isOpen: false
  },
]

for (var i = 0; i < modeArr.length; i++) {
  let item = modeArr[i]
  // 获取右上角按钮绑定原生点击事件
  // EventBus.getInstance().emit(item.mode, false)
  document.getElementById(item.mode).onclick = function () {
    paiTa(item) // 其他的项回到初始化
    setTimeout(()=>{
      item.isOpen = !item.isOpen // 控制打开状态等
      // 触发这个名字在发布订阅对象里，下属数组里所有方法触发，并传递第二个参数过去
      EventBus.getInstance().emit(item.mode, item.isOpen)
    }, 200)
  }
}

function paiTa(item){
  modeArr.forEach((obj)=>{
    if(obj.mode!==item.mode){
      obj.isOpen = false
      EventBus.getInstance().emit(obj.mode, obj.isOpen)
    }
  })
}
