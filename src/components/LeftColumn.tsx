import React from 'react'
import ReactECharts from 'echarts-for-react'
import { TemperatureIcon, DeviceCountIcon, HumidityIcon } from './SmartBuildingIcons'
import './LeftColumn.css'

const LeftColumn: React.FC = () => {
  // 饼图配置 - 非工作时段用电占比
  const pieChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}度 ({d}%)'
    },
    legend: {
      bottom: '5%',
      left: 'center',
      textStyle: {
        color: '#333333'
      }
    },
    series: [
      {
        name: '用电量',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#FFFFFF',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{c}度',
          color: '#333333',
          fontSize: 12
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: [
          { value: 365.5, name: '工作时间用电量', itemStyle: { color: '#3E7BFA' } },
          { value: 163, name: '非工作时间用电量', itemStyle: { color: '#F96418' } }
        ]
      }
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '40%',
        style: {
          text: '总用电量',
          textAlign: 'center',
          fill: '#666666',
          fontSize: 14
        }
      },
      {
        type: 'text',
        left: 'center',
        top: '48%',
        style: {
          text: '528.5',
          textAlign: 'center',
          fill: '#3E7BFA',
          fontSize: 24,
          fontWeight: 'bold'
        }
      },
      {
        type: 'text',
        left: 'center',
        top: '58%',
        style: {
          text: '度',
          textAlign: 'center',
          fill: '#666666',
          fontSize: 12
        }
      }
    ]
  }

  // 柱状图配置 - 近7天设备用电量
  const barChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['空调', '照明'],
      top: '5%',
      textStyle: {
        color: '#333333'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['12/12', '12/13', '12/14', '12/15', '12/16', '12/17', '12/18'],
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
        data: [60, 65, 58, 70, 68, 72, 70],
        itemStyle: {
          color: '#3E7BFA'
        }
      },
      {
        name: '照明',
        type: 'bar',
        data: [35, 38, 32, 40, 38, 42, 40],
        itemStyle: {
          color: '#F96418'
        }
      }
    ]
  }

  return (
    <div className="left-column">
      {/* 当前状态 */}
      <div className="status-card">
        <div className="status-item">
          <TemperatureIcon className="status-icon" />
          <div className="status-value">21°</div>
          <div className="status-label">温度(℃)</div>
        </div>
        <div className="status-item">
          <HumidityIcon className="status-icon" />
          <div className="status-value">80%</div>
          <div className="status-label">湿度(%)</div>
        </div>
        <div className="status-item">
          <DeviceCountIcon className="status-icon" />
          <div className="status-value">20/78</div>
          <div className="status-label">设备数量</div>
        </div>
      </div>

      {/* 用电量统计 */}
      <div className="stat-card">
        <div className="stat-card-header">
          <div className="card-title">用电量统计</div>
          <div className="card-subtitle">单位: 度</div>
        </div>
        <div className="stat-grid">
          <div className="stat-item">
            <div className="stat-value">69.5</div>
            <div className="stat-label">日用电量</div>
            <div className="stat-line stat-line-blue"></div>
          </div>
          <div className="stat-item">
            <div className="stat-value">1008.5</div>
            <div className="stat-label">周用电量</div>
            <div className="stat-line stat-line-orange"></div>
          </div>
          <div className="stat-item">
            <div className="stat-value">4528.5</div>
            <div className="stat-label">月用电量</div>
            <div className="stat-line stat-line-green"></div>
          </div>
          <div className="stat-item">
            <div className="stat-value">124685.4</div>
            <div className="stat-label">年用电量</div>
            <div className="stat-line stat-line-red"></div>
          </div>
        </div>
      </div>

      {/* 非工作时段用电占比 */}
      <div className="chart-card">
        <div className="card-title">非工作时段用电占比</div>
        <div className="card-subtitle">单位: 度</div>
        <ReactECharts option={pieChartOption} style={{ height: '200px', width: '100%' }} />
      </div>

      {/* 近7天设备用电量 */}
      <div className="chart-card">
        <div className="card-title">近7天设备用电量</div>
        <ReactECharts option={barChartOption} style={{ height: '160px', width: '100%' }} />
      </div>
    </div>
  )
}

export default LeftColumn
