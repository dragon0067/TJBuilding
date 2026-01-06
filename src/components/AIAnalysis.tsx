import React, { useState, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import './AIAnalysis.css'

const AIAnalysis: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState('综合部办公室')
  const [timePeriod, setTimePeriod] = useState<'today' | 'week' | 'month' | 'year'>('today')

  const rooms = ['综合部办公室', '董事长办公室', '财务部', '技术办公室']

  // 堆叠柱状图配置
  const stackedBarOption = useMemo(() => {
    let xAxisData: string[]
    let acData: number[]
    let lightingData: number[]
    let savingData: number[]

    if (timePeriod === 'today') {
      xAxisData = ['00:00', '02:00', '04:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
      acData = [0, 0, 0, 16, 12, 9, 11, 12, 8, 7, 2]
      lightingData = [0, 0, 0, 12, 9, 6, 8, 9, 6, 5, 1]
      savingData = [0, 0, 0, 3, 2, 1, 1, 2, 1, 1, 0.5]
    } else if (timePeriod === 'week') {
      xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      acData = [45, 48, 42, 50, 46, 35, 30]
      lightingData = [35, 38, 32, 40, 36, 28, 25]
      savingData = [8, 9, 7, 10, 8, 6, 5]
    } else if (timePeriod === 'month') {
      xAxisData = ['第1周', '第2周', '第3周', '第4周']
      acData = [180, 195, 188, 175]
      lightingData = [140, 152, 145, 135]
      savingData = [32, 35, 33, 31]
    } else {
      xAxisData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      acData = [720, 680, 750, 700, 780, 750, 800, 820, 760, 740, 720, 700]
      lightingData = [560, 530, 580, 540, 600, 580, 620, 640, 590, 570, 560, 540]
      savingData = [128, 121, 133, 124, 138, 133, 142, 146, 135, 131, 128, 124]
    }

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params: any) {
          let result = params[0].name + '<br/>'
          params.forEach((item: any) => {
            result += item.marker + item.seriesName + ': ' + item.value + '度<br/>'
          })
          return result
        }
      },
      legend: {
        data: ['空调', '照明', '节能'],
        top: '5%',
        textStyle: {
          color: '#333333'
        },
        itemGap: 20
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLine: {
          lineStyle: {
            color: '#3E7BFA'
          }
        },
        axisLabel: {
          color: '#333333'
        }
      },
      yAxis: {
        type: 'value',
        name: '度',
        nameTextStyle: {
          color: '#666666'
        },
        axisLine: {
          lineStyle: {
            color: '#3E7BFA'
          }
        },
        axisLabel: {
          color: '#333333'
        },
        splitLine: {
          lineStyle: {
            color: '#EEEEEE'
          }
        }
      },
      series: [
        {
          name: '空调',
          type: 'bar',
          stack: 'total',
          data: acData,
          itemStyle: {
            color: '#3E7BFA'
          }
        },
        {
          name: '照明',
          type: 'bar',
          stack: 'total',
          data: lightingData,
          itemStyle: {
            color: '#F96418'
          }
        },
        {
          name: '节能',
          type: 'bar',
          stack: 'total',
          data: savingData,
          itemStyle: {
            color: '#CCCCCC'
          }
        }
      ]
    }
  }, [timePeriod])

  // 环形图配置
  const donutOption = useMemo(() => {
    let totalEnergy = 65.5
    let savingPercent = 25
    let acEnergy = 40
    let lightingEnergy = 25.5
    let acSavingPercent = 20
    let lightingSavingPercent = 45

    if (timePeriod === 'week') {
      totalEnergy = 320
      savingPercent = 24
      acEnergy = 195
      lightingEnergy = 152
      acSavingPercent = 18
      lightingSavingPercent = 42
    } else if (timePeriod === 'month') {
      totalEnergy = 1280
      savingPercent = 26
      acEnergy = 738
      lightingEnergy = 572
      acSavingPercent = 19
      lightingSavingPercent = 44
    } else if (timePeriod === 'year') {
      totalEnergy = 15360
      savingPercent = 25
      acEnergy = 8840
      lightingEnergy = 6840
      acSavingPercent = 20
      lightingSavingPercent = 45
    }

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}度 ({d}%)'
      },
      legend: {
        bottom: '5%',
        left: 'center',
        textStyle: {
          color: '#333333'
        },
        formatter: function (name: string) {
          if (name === '空调') {
            return `${acEnergy}(${acSavingPercent}%) 空调(度)/节能`
          } else if (name === '照明') {
            return `${lightingEnergy}(${lightingSavingPercent}%) 照明(度)/节能`
          }
          return name
        }
      },
      series: [
        {
          name: '用电量',
          type: 'pie',
          radius: ['45%', '65%'],
          center: ['50%', '40%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#FFFFFF',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          data: [
            { value: acEnergy, name: '空调', itemStyle: { color: '#3E7BFA' } },
            { value: lightingEnergy, name: '照明', itemStyle: { color: '#F96418' } }
          ]
        }
      ],
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: '32%',
          style: {
            text: '总用电量(度)',
            textAlign: 'center',
            fill: '#666666',
            fontSize: 14
          }
        },
        {
          type: 'text',
          left: 'center',
          top: '38%',
          style: {
            text: totalEnergy.toFixed(1),
            textAlign: 'center',
            fill: '#3E7BFA',
            fontSize: 24,
            fontWeight: 'bold'
          }
        },
        {
          type: 'text',
          left: 'center',
          top: '46%',
          style: {
            text: `节能(%)`,
            textAlign: 'center',
            fill: '#666666',
            fontSize: 14
          }
        },
        {
          type: 'text',
          left: 'center',
          top: '52%',
          style: {
            text: `${savingPercent}%`,
            textAlign: 'center',
            fill: '#3E7BFA',
            fontSize: 24,
            fontWeight: 'bold'
          }
        }
      ]
    }
  }, [timePeriod])

  return (
    <div className="ai-analysis">
      <div className="ai-header">
        <h2 className="ai-title">AI节能效果分析</h2>
        <div className="ai-controls">
          <select
            className="room-select"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            {rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
          <div className="time-tabs">
            <button
              className={`time-tab ${timePeriod === 'today' ? 'active' : ''}`}
              onClick={() => setTimePeriod('today')}
            >
              当天
            </button>
            <button
              className={`time-tab ${timePeriod === 'week' ? 'active' : ''}`}
              onClick={() => setTimePeriod('week')}
            >
              当周
            </button>
            <button
              className={`time-tab ${timePeriod === 'month' ? 'active' : ''}`}
              onClick={() => setTimePeriod('month')}
            >
              当月
            </button>
            <button
              className={`time-tab ${timePeriod === 'year' ? 'active' : ''}`}
              onClick={() => setTimePeriod('year')}
            >
              本年度
            </button>
          </div>
        </div>
      </div>
      <div className="ai-charts">
        <div className="chart-container">
          <ReactECharts option={stackedBarOption} style={{ height: '100%', width: '100%' }} />
        </div>
        <div className="chart-container">
          <ReactECharts option={donutOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    </div>
  )
}

export default AIAnalysis


