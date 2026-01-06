import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './RoomControl.css'

interface Device {
  id: string
  name: string
  type: '电脑' | '插座' | '灯' | '投影仪' | '空调'
  status: boolean // true=开, false=关
  lastReportTime: string
  lastReportMinutes: number
}

const RoomControl: React.FC = () => {
  const { floor, roomName } = useParams<{ floor: string; roomName: string }>()
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 9

  // 模拟设备数据
  useEffect(() => {
    // 模拟加载延迟
    setTimeout(() => {
      // 按照UI图的数据
      const mockDevices: Device[] = [
        { id: '1', name: '01电脑', type: '电脑', status: true, lastReportTime: '25-12-22 08:31', lastReportMinutes: 9 },
        { id: '2', name: '01插座', type: '插座', status: true, lastReportTime: '25-12-22 08:30', lastReportMinutes: 10 },
        { id: '3', name: '右侧靠窗照明灯', type: '灯', status: true, lastReportTime: '25-12-22 08:29', lastReportMinutes: 11 },
        { id: '4', name: '投影仪', type: '投影仪', status: true, lastReportTime: '25-12-22 08:28', lastReportMinutes: 12 },
        { id: '5', name: '投影仪', type: '投影仪', status: true, lastReportTime: '25-12-22 08:27', lastReportMinutes: 13 },
        { id: '6', name: '03电脑', type: '电脑', status: false, lastReportTime: '25-12-22 08:26', lastReportMinutes: 14 },
        { id: '7', name: '03插座', type: '插座', status: false, lastReportTime: '25-12-22 08:25', lastReportMinutes: 15 },
        { id: '8', name: '空调', type: '空调', status: true, lastReportTime: '25-12-22 08:24', lastReportMinutes: 16 },
        { id: '9', name: '打印机处电脑', type: '电脑', status: true, lastReportTime: '25-12-22 08:23', lastReportMinutes: 17 },
      ]
      setDevices(mockDevices)
      setLoading(false)
    }, 500)
  }, [floor, roomName])

  // 计算设备类型统计
  const deviceStats = devices.reduce((acc, device) => {
    if (!acc[device.type]) {
      acc[device.type] = { total: 0, active: 0 }
    }
    acc[device.type].total++
    if (device.status) {
      acc[device.type].active++
    }
    return acc
  }, {} as Record<string, { total: number; active: number }>)

  // 切换设备状态
  const toggleDeviceStatus = (deviceId: string) => {
    setDevices(devices.map(device => 
      device.id === deviceId ? { ...device, status: !device.status } : device
    ))
  }

  // 刷新设备
  const refreshDevice = (deviceId: string) => {
    // 模拟刷新：更新最后上报时间
    setDevices(devices.map(device => 
      device.id === deviceId 
        ? { 
            ...device, 
            lastReportTime: new Date().toLocaleString('zh-CN', { 
              year: '2-digit', 
              month: '2-digit', 
              day: '2-digit', 
              hour: '2-digit', 
              minute: '2-digit' 
            }).replace(/\//g, '-'),
            lastReportMinutes: 0
          } 
        : device
    ))
  }

  // 获取设备图标路径
  const getDeviceIcon = (type: string, status: boolean) => {
    const iconMap: Record<string, { on: string; off: string }> = {
      '电脑': { on: '/智慧楼宇图标/设备列表/电脑开.png', off: '/智慧楼宇图标/设备列表/电脑关.png' },
      '插座': { on: '/智慧楼宇图标/设备列表/插座开.png', off: '/智慧楼宇图标/设备列表/插座关.png' },
      '灯': { on: '/智慧楼宇图标/设备列表/照明灯开.png', off: '/智慧楼宇图标/设备列表/照明灯关.png' },
      '投影仪': { on: '/智慧楼宇图标/设备列表/投影仪开.png', off: '/智慧楼宇图标/设备列表/投影仪关.png' },
      '空调': { on: '/智慧楼宇图标/设备列表/空调 开.png', off: '/智慧楼宇图标/设备列表/空调关.png' }
    }
    const icons = iconMap[type] || { on: '', off: '' }
    return status ? icons.on : icons.off
  }

  // 分页
  const totalPages = Math.ceil(devices.length / pageSize)
  const paginatedDevices = devices.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="room-control-container">
      <div className="room-control-header">
        <div className="device-stats">
          {Object.entries(deviceStats).map(([type, stats]) => (
            <span key={type} className="stat-item">
              {type} {stats.active}/{stats.total}
            </span>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      ) : (
        <>
          <div className="device-grid">
            {paginatedDevices.map(device => (
              <div key={device.id} className="device-card">
                <div className="device-card-header">
                  <span className="device-name">{device.name}</span>
                  <div className="header-icons">
                    <img 
                      src="/智慧楼宇图标/设备列表/定时@1x.png" 
                      alt="定时" 
                      className="header-icon"
                    />
                    <button 
                      className="refresh-btn"
                      onClick={() => refreshDevice(device.id)}
                      title="刷新"
                    >
                      <img 
                        src="/智慧楼宇图标/设备列表/刷新.png" 
                        alt="刷新" 
                        className="refresh-icon"
                      />
                    </button>
                  </div>
                </div>
                
                <div className="device-main-content">
                  <div className="device-icon-section">
                    <img 
                      src={getDeviceIcon(device.type, device.status)} 
                      alt={device.type}
                      className={`device-icon ${device.status ? 'active' : 'inactive'}`}
                    />
                  </div>

                  <div className="device-control-section">
                    <div className="device-status-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={device.status}
                          onChange={() => toggleDeviceStatus(device.id)}
                        />
                        <span className={`slider ${device.status ? 'on' : 'off'}`}>
                          <span className="toggle-text">{device.status ? 'ON' : 'OFF'}</span>
                        </span>
                      </label>
                    </div>
                    <div className="device-type">类型: {device.type}</div>
                  </div>
                </div>

                <div className="device-time">
                  最后上报时间: {device.lastReportTime}[{device.lastReportMinutes}分]
                </div>

                <div className="device-actions">
                  <button className="action-btn">
                    <img 
                      src="/智慧楼宇图标/设备列表/查看详情.png" 
                      alt="详情" 
                      className="action-icon"
                    />
                    <span>详情</span>
                  </button>
                  <span className="action-separator">|</span>
                  <button className="action-btn">
                    <img 
                      src="/智慧楼宇图标/设备列表/状态.png" 
                      alt="状态" 
                      className="action-icon"
                    />
                    <span>状态</span>
                  </button>
                  <span className="action-separator">|</span>
                  <button className="action-btn">
                    <img 
                      src="/智慧楼宇图标/设备列表/数据监测.png" 
                      alt="数据监测" 
                      className="action-icon"
                    />
                    <span>数据监测</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <span className="pagination-info">共{devices.length}条</span>
              <div className="pagination-controls">
                <button 
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  上一页
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default RoomControl
