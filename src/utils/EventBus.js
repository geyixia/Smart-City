// 发布订阅模式（注入名字和函数）进行调度
export class EventBus {
  constructor() {
    this.eventMap = {}
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new EventBus()
    }
    return this.instance
  }
  on(eventName, fn) {
    if (!this.eventMap[eventName]) {
      this.eventMap[eventName] = []
    }
    this.eventMap[eventName].push(fn)
  }
  emit(eventName, ...args) {
    if (!this.eventMap[eventName]) return
    this.eventMap[eventName].forEach((fn) => {
      fn(...args)
    })
  }
}