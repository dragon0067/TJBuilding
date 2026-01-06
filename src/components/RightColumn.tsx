import React from 'react'
import ReactECharts from 'echarts-for-react'
import './RightColumn.css'

const RightColumn: React.FC = () => {

  // 空调用电排行
  const acRankingOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '15%',
      right: '5%',
      bottom: '5%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
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
    yAxis: {
      type: 'category',
      data: ['厂房6楼', '厂房2楼', '办公楼2楼', '厂房4楼', '办公楼3楼', '厂房1楼'],
      axisLine: {
        lineStyle: {
          color: '#3E7BFA'
        }
      },
      axisLabel: {
        color: '#333333'
      }
    },
    series: [
      {
        type: 'bar',
        data: [15.6, 15.8, 16.5, 22.5, 32.8, 30.7],
        itemStyle: {
          color: '#3E7BFA'
        },
        label: {
          show: true,
          position: 'right',
          color: '#333333',
          formatter: '{c}度'
        }
      }
    ]
  }

  // 照明用电排行
  const lightingRankingOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '15%',
      right: '5%',
      bottom: '5%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
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
    yAxis: {
      type: 'category',
      data: ['厂房6楼', '厂房2楼', '办公楼2楼', '厂房4楼', '办公楼3楼', '厂房1楼'],
      axisLine: {
        lineStyle: {
          color: '#3E7BFA'
        }
      },
      axisLabel: {
        color: '#333333'
      }
    },
    series: [
      {
        type: 'bar',
        data: [15.6, 15.8, 16.5, 22.5, 32.8, 30.7],
        itemStyle: {
          color: '#F96418'
        },
        label: {
          show: true,
          position: 'right',
          color: '#333333',
          formatter: '{c}度'
        }
      }
    ]
  }

  return (
    <div className="right-column">
      {/* 用电量分析 */}
      <div className="analysis-card">
        <div className="card-title">用电量分析</div>
        <div className="card-subtitle">单位: 度</div>
        <div className="analysis-grid">
          <div className="analysis-item">
            <div className="analysis-label">当日照明能耗</div>
            <div className="analysis-value">2.4</div>
          </div>
          <div className="analysis-item">
            <div className="analysis-label">当月照明能耗</div>
            <div className="analysis-value">154.5</div>
          </div>
          <div className="analysis-item">
            <div className="analysis-label">当日空调能耗</div>
            <div className="analysis-value">10.5</div>
          </div>
          <div className="analysis-item">
            <div className="analysis-label">当月空调能耗</div>
            <div className="analysis-value">238.6</div>
          </div>
        </div>
      </div>

      {/* 空调用电排行 */}
      <div className="chart-card">
        <div className="card-title">空调用电排行</div>
        <div className="card-subtitle">单位: 度</div>
        <ReactECharts option={acRankingOption} style={{ height: '220px', width: '100%' }} />
      </div>

      {/* 照明用电排行 */}
      <div className="chart-card">
        <div className="card-title">照明用电排行</div>
        <div className="card-subtitle">单位: 度</div>
        <ReactECharts option={lightingRankingOption} style={{ height: '220px', width: '100%' }} />
      </div>
    </div>
  )
}

export default RightColumn
