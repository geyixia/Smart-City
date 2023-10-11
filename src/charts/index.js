import * as echarts from 'echarts'
import { EventBus } from '@/utils/eventBus'
import { DataManager } from '@/utils/DataManager'
import gsap from 'gsap'

window.addEventListener('DOMContentLoaded', () => {
  // 创建柱状图
  const myBarChart = echarts.init(document.getElementById('bar-chart'))
  // 创建饼状图
  const myPieChart = echarts.init(document.getElementById('pie-chart'))

  // 开始初始化 ECharts 图表
  initChart()

  async function initChart() {
    // 获取默认数据
    let dataJson = await DataManager.getInstance().getData()

    // 解构需要的数据
    const {
      parkIncome: { yIncome },
      parkIndustry,
      base,
    } = dataJson

    // ECharts 配置项
    const barOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        // 让图表占满容器
        top: '10px',
        left: '0px',
        right: '0px',
        bottom: '0px',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
            show: false,
          },
          data: [
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
            "1月",
            "2月",
            "3月",
            "4月",
            "5月"
          ],
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '居民收入情况',
          type: 'bar',
          barWidth: '10px',
          data: yIncome.map((item, index) => {
            const color =
              index % 2 === 0
                ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0.23, color: '#74c0f8' },
                  { offset: 1, color: 'rgba(116,192,248,0.00)' },
                ])
                : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0.23, color: '#ff7152' },
                  { offset: 1, color: 'rgba(255,113,82,0.00)' },
                ]);
            return { value: item, itemStyle: { color } };
          }),
        },
      ],
      textStyle: {
        color: '#B4C0CC',
      },
    };

    const pieOption = {
      color: [
        '#00B2FF', '#2CF2FF', '#892CFF', '#FF624D', '#FFCF54', '#86ECA2'],
      legend: {
        itemGap: 20,
        bottom: '0',
        icon: 'rect',
        itemHeight: 10, // 图例icon高度
        itemWidth: 10, // 图例icon宽度
        textStyle: {
          color: '#c6d1db',
        },
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '产业分布',
          type: 'pie',
          radius: ['55%', '60%'], // 设置内圈与外圈的半径使其呈现为环形
          center: ['50%', '40%'], // 圆心位置， 用于调整整个图的位置
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              return `${params.seriesName}</br><div style='display:flex;justify-content: space-between;'><div>${params.marker}${params.name}</div><div>${params.percent}%</div></div>`;

            }
          },
          label: {
            show: false,
            position: 'center',
          },
          data: parkIndustry,
        },
      ],
    };

    // 给图表设置配置项
    myBarChart.setOption(barOption);
    myPieChart.setOption(pieOption);

    // 饼状图-点击事件
    myPieChart.on('click', function (param) { 
      // 0 素质教育
      // 1 医疗健康  
      // 2 生活服务
      // 3 商业娱乐
      // 4 其他
      if (param.dataIndex == 0) {
        EventBus.getInstance().emit('pieClick', "Shanghai-02")
      } else if (param.dataIndex == 1) {
        EventBus.getInstance().emit('pieClick', "Shanghai-03")
      } else if (param.dataIndex == 2) {
        EventBus.getInstance().emit('pieClick', "Shanghai-04")
      } else if (param.dataIndex == 3) {
        EventBus.getInstance().emit('pieClick', "Shanghai-05")
      } else if (param.dataIndex == 4) {
        EventBus.getInstance().emit('pieClick', "Shanghai-06")
      } 
      // 07 模型暂时没用上
    });

    // ECharts 适配
    window.addEventListener('resize', function () {
      myPieChart.resize();
      myBarChart.resize();
    });
  }

  // 更新左上角-城市概况数据
  EventBus.getInstance().on('refreshHomeCount', (data) => {
    console.log('监听')
    animateValue(data)
  })

  // 数据动画更新效果
  async function animateValue(data) {
    if (data && data.base) {
      const { buildingTotal, chargePoleTotal, enterpriseTotal, parkingTotal } = data.base
      gsap.to('#building-number', {
        duration: 1,
        innerText: function () { return buildingTotal.toFixed(0) },
        transformOrigin: 'center bottom',
        onUpdate: function () {
          let n = (gsap.getProperty(this.targets()[0], "innerText"));
          this.targets()[0].innerText = n.toFixed(0)
        },
      })
      gsap.to('#enterprise-number', {
        duration: 1,
        innerText: function () { return chargePoleTotal.toFixed(0) },
        transformOrigin: 'center bottom',
        onUpdate: function () {
          let n = (gsap.getProperty(this.targets()[0], "innerText"));
          this.targets()[0].innerText = n.toFixed(0)
        },
      })
      gsap.to('#car-number', {
        duration: 1,
        innerText: function () { return enterpriseTotal.toFixed(0) },
        transformOrigin: 'center bottom',
        onUpdate: function () {
          let n = (gsap.getProperty(this.targets()[0], "innerText"));
          this.targets()[0].innerText = n.toFixed(0)
        },
      })
      gsap.to('#rod-number', {
        duration: 1,
        innerText: function () { return parkingTotal.toFixed(0) },
        transformOrigin: 'center bottom',
        onUpdate: function () {
          let n = (gsap.getProperty(this.targets()[0], "innerText"));
          this.targets()[0].innerText = n.toFixed(0)
        },
      })
    }
  }
})


