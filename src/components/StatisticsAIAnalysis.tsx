import React, { useMemo } from 'react'
import './StatisticsAIAnalysis.css'

interface RoomStat {
  name: string
  door: number
  occupied: number
  ac: number
  light: number
  energy?: number
  power?: number
}

interface StatisticsAIAnalysisProps {
  floor?: string
  room?: string
  roomStatistics?: RoomStat[]
  totalHours?: {
    door: number
    occupied: number
    ac: number
    light: number
  }
}

interface AnalysisIssue {
  type: 'warning' | 'error' | 'info'
  title: string
  description: string
  suggestion: string
  room?: string
}

const StatisticsAIAnalysis: React.FC<StatisticsAIAnalysisProps> = ({ 
  floor, 
  room, 
  roomStatistics = [],
  totalHours 
}) => {
  // 分析统计数据，识别问题
  const analysis = useMemo(() => {
    const issues: AnalysisIssue[] = []
    
    // 楼层统计模式
    if (floor && roomStatistics.length > 0) {
      // 计算平均值
      const avgDoor = roomStatistics.reduce((sum, r) => sum + r.door, 0) / roomStatistics.length
      const avgOccupied = roomStatistics.reduce((sum, r) => sum + r.occupied, 0) / roomStatistics.length
      const avgAc = roomStatistics.reduce((sum, r) => sum + r.ac, 0) / roomStatistics.length
      const avgLight = roomStatistics.reduce((sum, r) => sum + r.light, 0) / roomStatistics.length
      
      // 检查异常房间
      roomStatistics.forEach(roomStat => {
        // 门开启时长异常（超过平均值50%）
        if (roomStat.door > avgDoor * 1.5) {
          issues.push({
            type: 'warning',
            title: '门开启时长异常',
            description: `${roomStat.name}的门开启时长(${roomStat.door}h)明显高于楼层平均值(${avgDoor.toFixed(1)}h)`,
            suggestion: '建议检查该房间的门禁系统是否正常工作，可能存在门未正常关闭的情况。',
            room: roomStat.name
          })
        }
        
        // 有人时长异常（超过平均值50%或低于平均值50%）
        if (roomStat.occupied > avgOccupied * 1.5) {
          issues.push({
            type: 'info',
            title: '使用时长较高',
            description: `${roomStat.name}的使用时长(${roomStat.occupied}h)明显高于楼层平均值(${avgOccupied.toFixed(1)}h)`,
            suggestion: '该房间使用频率较高，建议关注其能耗情况，考虑优化使用时段。',
            room: roomStat.name
          })
        } else if (roomStat.occupied < avgOccupied * 0.5 && avgOccupied > 2) {
          issues.push({
            type: 'info',
            title: '使用时长较低',
            description: `${roomStat.name}的使用时长(${roomStat.occupied}h)明显低于楼层平均值(${avgOccupied.toFixed(1)}h)`,
            suggestion: '该房间使用频率较低，建议检查是否需要调整房间配置或考虑合并使用。',
            room: roomStat.name
          })
        }
        
        // 空调开启时长异常
        if (roomStat.ac > avgAc * 1.5) {
          issues.push({
            type: 'warning',
            title: '空调用时长异常',
            description: `${roomStat.name}的空调开启时长(${roomStat.ac}h)明显高于楼层平均值(${avgAc.toFixed(1)}h)`,
            suggestion: '建议检查该房间的空调设置，可能存在温度设置过低或设备故障的情况。考虑调整温度设定或进行设备检修。',
            room: roomStat.name
          })
        }
        
        // 照明开启时长异常
        if (roomStat.light > avgLight * 1.5) {
          issues.push({
            type: 'warning',
            title: '照明开启时长异常',
            description: `${roomStat.name}的照明开启时长(${roomStat.light}h)明显高于楼层平均值(${avgLight.toFixed(1)}h)`,
            suggestion: '建议检查该房间的照明系统，可能存在忘记关灯或自动控制系统故障的情况。考虑安装自动感应开关。',
            room: roomStat.name
          })
        }
      })
      
      // 楼层整体分析
      const totalDoor = roomStatistics.reduce((sum, r) => sum + r.door, 0)
      const totalAc = roomStatistics.reduce((sum, r) => sum + r.ac, 0)
      const totalLight = roomStatistics.reduce((sum, r) => sum + r.light, 0)
      
      // 检查是否有房间门开启时长过长（超过8小时）
      const longDoorRooms = roomStatistics.filter(r => r.door > 8)
      if (longDoorRooms.length > 0) {
        issues.push({
          type: 'error',
          title: '门开启时长过长',
          description: `发现${longDoorRooms.length}个房间的门开启时长超过8小时，可能存在安全隐患`,
          suggestion: '建议立即检查这些房间的门禁系统，确保门能够正常关闭。考虑加强门禁管理或安装自动关门装置。',
          room: longDoorRooms.map(r => r.name).join('、')
        })
      }
      
      // 检查空调和照明使用情况
      if (totalAc / roomStatistics.length > 10) {
        issues.push({
          type: 'warning',
          title: '楼层空调用时长偏高',
          description: `该楼层平均空调用时长${(totalAc / roomStatistics.length).toFixed(1)}小时，整体偏高`,
          suggestion: '建议优化空调使用策略，考虑统一温度设定、错峰使用或安装智能温控系统。',
        })
      }
      
      if (totalLight / roomStatistics.length > 10) {
        issues.push({
          type: 'info',
          title: '楼层照明使用时长偏高',
          description: `该楼层平均照明使用时长${(totalLight / roomStatistics.length).toFixed(1)}小时，整体偏高`,
          suggestion: '建议优化照明使用，考虑安装自动感应开关、使用LED节能灯具或加强人员节能意识。',
        })
      }
    }
    
    // 单个房间统计模式
    if (room && totalHours) {
      // 检查门开启时长
      if (totalHours.door > 8) {
        issues.push({
          type: 'error',
          title: '门开启时长过长',
          description: `该房间门开启时长${totalHours.door}小时，超过安全阈值`,
          suggestion: '建议立即检查门禁系统，确保门能够正常关闭。可能存在门禁故障或未正常关闭的情况。',
        })
      } else if (totalHours.door > 6) {
        issues.push({
          type: 'warning',
          title: '门开启时长较长',
          description: `该房间门开启时长${totalHours.door}小时，建议关注`,
          suggestion: '建议检查门禁系统是否正常工作，考虑安装自动关门装置或加强管理。',
        })
      }
      
      // 检查空调使用
      if (totalHours.ac > 12) {
        issues.push({
          type: 'warning',
          title: '空调用时长过长',
          description: `该房间空调开启时长${totalHours.ac}小时，能耗较高`,
          suggestion: '建议优化空调使用，考虑调整温度设定（建议26°C）、使用定时功能或检查设备是否正常工作。',
        })
      }
      
      // 检查照明使用
      if (totalHours.light > 12) {
        issues.push({
          type: 'warning',
          title: '照明开启时长过长',
          description: `该房间照明开启时长${totalHours.light}小时，可能存在浪费`,
          suggestion: '建议检查照明系统，考虑安装自动感应开关、使用LED节能灯具或加强人员节能意识。',
        })
      }
      
      // 检查使用效率
      const usageRatio = totalHours.occupied > 0 ? (totalHours.ac + totalHours.light) / totalHours.occupied : 0
      if (usageRatio > 2) {
        issues.push({
          type: 'info',
          title: '设备使用效率偏低',
          description: `该房间设备使用时长与人员使用时长比例较高，可能存在设备未及时关闭的情况`,
          suggestion: '建议加强设备管理，确保人员离开时及时关闭空调和照明设备。考虑安装自动控制系统。',
        })
      }
    }
    
    // 如果没有发现问题，给出正面反馈
    if (issues.length === 0) {
      if (floor) {
        issues.push({
          type: 'info',
          title: '楼层使用情况良好',
          description: `该楼层各房间的使用情况正常，未发现明显异常`,
          suggestion: '继续保持良好的使用习惯，定期检查设备运行状态，确保节能高效。',
        })
      } else if (room) {
        issues.push({
          type: 'info',
          title: '房间使用情况良好',
          description: `该房间的使用情况正常，各项指标在合理范围内`,
          suggestion: '继续保持良好的使用习惯，注意及时关闭不需要的设备，确保节能高效。',
        })
      } else {
        // 如果没有选择楼层或房间，显示提示信息
        issues.push({
          type: 'info',
          title: '等待数据选择',
          description: '请选择一个楼层或房间以查看AI智能分析结果',
          suggestion: '点击左侧的楼层或房间卡片来查看详细的状态统计和AI分析。',
        })
      }
    }
    
    return issues
  }, [floor, room, roomStatistics, totalHours])

  return (
    <div className="statistics-ai-analysis">
      <div className="ai-analysis-header">
        <h4 className="ai-analysis-title">
          <span className="ai-icon">🤖</span>
          AI智能分析
        </h4>
      </div>
      <div className="ai-analysis-content">
        {analysis.length === 0 ? (
          <div className="analysis-loading">正在分析数据...</div>
        ) : (
          <div className="analysis-issues">
            {analysis.map((issue, index) => (
              <div key={index} className={`analysis-issue ${issue.type}`}>
                <div className="issue-header">
                  <span className={`issue-icon ${issue.type}`}>
                    {issue.type === 'error' ? '⚠️' : issue.type === 'warning' ? '⚡' : 'ℹ️'}
                  </span>
                  <span className="issue-title">{issue.title}</span>
                  {issue.room && (
                    <span className="issue-room">{issue.room}</span>
                  )}
                </div>
                <div className="issue-description">{issue.description}</div>
                <div className="issue-suggestion">
                  <strong>建议：</strong>{issue.suggestion}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatisticsAIAnalysis

