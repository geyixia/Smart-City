import { EventBus } from '@/utils/EventBus'
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:4523/m1/3395945-0-default'

export class DataManager {
  static getInstance() {
    if (!this.instance) {
      this.instance = new DataManager()
    }
    return this.instance
  }
  // 获取数据
  getData() {
    console.log(222)
    return new Promise((resolve, reject) => {
      console.log(111)
      axios.get("/city").then(response => {
        resolve(response.data)
      })
    })
  }
  // 模拟轮询请求服务器
  refreshData() {
    // 15 秒刷新一次数据
    setInterval(async () => {
      let data = await this.getData()
      EventBus.getInstance().emit('refreshHomeCount', data)
    }, 15000)
  }
}

