import React, { useState, lazy, Suspense, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import MiddleColumn from './MiddleColumn'
import StatusStatistics from './StatusStatistics'
import FloatingAIAnalysis from './FloatingAIAnalysis'
import RoomControl from './RoomControl'
import { UserIcon } from './SmartBuildingIcons'
import './HomePage.css'

// 延迟加载 FloorPlan 组件，避免 CSS 影响首页
const FloorPlan = lazy(() => import('./FloorPlan'))
const LightFloorPlan = lazy(() => import('./LightFloorPlan'))
const ACFloorPlan = lazy(() => import('./ACFloorPlan'))

interface HomePageProps {
  showRoomControl?: boolean
}

const HomePage: React.FC<HomePageProps> = ({ showRoomControl: propShowRoomControl }) => {
  const params = useParams<{ floor?: string; roomName?: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  
  // 从路由判断是否显示房间控制页面
  const showRoomControl = propShowRoomControl || location.pathname.startsWith('/room-control')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [statisticsVisible, setStatisticsVisible] = useState(true)
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null)
  const [selectedFloorRoomCount, setSelectedFloorRoomCount] = useState<number | undefined>(undefined)
  const [selectedFloorRooms, setSelectedFloorRooms] = useState<Array<{ name: string }> | undefined>(undefined)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [showFloorPlan, setShowFloorPlan] = useState(false)
  const [floorPlanFloor, setFloorPlanFloor] = useState<string | null>(null)
  const [floorPlanRoom, setFloorPlanRoom] = useState<string | null>(null)
  const [showACFloorPlan, setShowACFloorPlan] = useState(false)
  const [acFloorPlanFloor, setACFloorPlanFloor] = useState<string | null>(null)
  const [showLightFloorPlan, setShowLightFloorPlan] = useState(false)
  const [lightFloorPlanFloor, setLightFloorPlanFloor] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // 计算是否为楼层模式
  const isFloorMode = selectedFloor && selectedFloorRoomCount && selectedFloorRoomCount > 1 && !selectedRoom

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  // 处理平面图点击
  const handleFloorPlanClick = (floor: string, roomName: string) => {
    setFloorPlanFloor(floor)
    setFloorPlanRoom(roomName)
    setShowFloorPlan(true)
  }

  // 处理空调平面图点击
  const handleACFloorPlanClick = (floor: string) => {
    setACFloorPlanFloor(floor)
    setShowACFloorPlan(true)
  }

  // 处理照明平面图点击
  const handleLightFloorPlanClick = (floor: string) => {
    setLightFloorPlanFloor(floor)
    setShowLightFloorPlan(true)
  }

  // 简单的随机数生成器（基于种子）- 确保同一楼层的数据保持一致
  const seededRandom = (seed: number) => {
    let value = seed
    return () => {
      value = (value * 9301 + 49297) % 233280
      return value / 233280
    }
  }

  // 示例设备数据（实际应该从API获取）
  const getFloorPlanDevices = () => {
    // 根据选中的楼层和房间返回对应的设备数据
    return [
      {
        id: '1',
        name: '空调-001',
        type: 'airConditioner' as const,
        status: 'on' as const,
        position: { x: 20, y: 30 },
        room: floorPlanRoom || '房间',
        power: 2000,
        temperature: 26,
        description: '中央空调系统'
      },
      {
        id: '2',
        name: '照明灯-001',
        type: 'light' as const,
        status: 'on' as const,
        position: { x: 25, y: 35 },
        room: floorPlanRoom || '房间',
        power: 50,
        description: 'LED照明灯'
      },
      {
        id: '3',
        name: '插座-001',
        type: 'socket' as const,
        status: 'on' as const,
        position: { x: 30, y: 40 },
        room: floorPlanRoom || '房间',
        power: 100,
        description: '智能插座'
      },
      {
        id: '4',
        name: '电脑-001',
        type: 'computer' as const,
        status: 'on' as const,
        position: { x: 50, y: 45 },
        room: floorPlanRoom || '房间',
        power: 150,
        description: '办公电脑'
      },
      {
        id: '5',
        name: '投影仪-001',
        type: 'projector' as const,
        status: 'off' as const,
        position: { x: 70, y: 50 },
        room: floorPlanRoom || '房间',
        power: 300,
        description: '投影设备'
      }
    ]
  }

  // 获取楼层所有空调设备数据（实际应该从API获取）
  // 使用 useMemo 缓存，确保同一楼层的数据保持一致
  const getACFloorPlanDevices = useMemo(() => {
    return (floor: string) => {
      // 根据楼层名称生成固定种子，确保同一楼层的数据一致
      const seed = floor.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + 1000
      const random = seededRandom(seed)
      
      // 根据楼层返回该楼层所有房间的空调设备
      // 这里使用示例数据，实际应该从API获取
      const devices = []
      for (let i = 1; i <= 10; i++) {
        // 使用固定种子生成随机数，确保每次调用结果一致
        const statusRandom = random()
        const posXRandom = random()
        const posYRandom = random()
        const powerRandom = random()
        const tempRandom = random()
        
        devices.push({
          id: `ac-${floor}-${i}`,
          name: `${floor}-空调-${String(i).padStart(3, '0')}`,
          type: 'airConditioner' as const,
          status: (statusRandom > 0.3 ? 'on' : 'off') as const,
          position: { 
            x: 10 + (i % 5) * 20 + posXRandom * 5, 
            y: 20 + Math.floor(i / 5) * 30 + posYRandom * 5 
          },
          room: `${floor}-房间${i}`,
          power: 1500 + Math.floor(powerRandom * 1000),
          temperature: 20 + Math.floor(tempRandom * 8),
          description: '中央空调系统'
        })
      }
      return devices
    }
  }, [])

  // 获取楼层所有照明设备数据（实际应该从API获取）
  // 使用 useMemo 缓存，确保同一楼层的数据保持一致
  const getLightFloorPlanDevices = useMemo(() => {
    return (floor: string) => {
      // 根据楼层名称生成固定种子，确保同一楼层的数据一致
      const seed = floor.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const random = seededRandom(seed)
      
      // 根据楼层返回该楼层所有房间的照明设备
      // 这里使用示例数据，实际应该从API获取
      const devices = []
      for (let i = 1; i <= 10; i++) {
        // 使用固定种子生成随机数，确保每次调用结果一致
        const statusRandom = random()
        const posXRandom = random()
        const posYRandom = random()
        const powerRandom = random()
        
        devices.push({
          id: `light-${floor}-${i}`,
          name: `${floor}-照明-${String(i).padStart(3, '0')}`,
          type: 'light' as const,
          status: (statusRandom > 0.3 ? 'on' : 'off') as const,
          position: { 
            x: 10 + (i % 5) * 20 + posXRandom * 5, 
            y: 20 + Math.floor(i / 5) * 30 + posYRandom * 5 
          },
          room: `${floor}-房间${i}`,
          power: 30 + Math.floor(powerRandom * 40),
          description: 'LED照明灯'
        })
      }
      return devices
    }
  }, [])

  return (
    <div className="home-page">
      <Sidebar onCollapseChange={setSidebarCollapsed} />
      <div className={`home-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className={`home-main ${!statisticsVisible ? 'full-height' : ''}`}>
          {showRoomControl && params.floor && params.roomName ? (
            <div className="room-control-wrapper">
              <div className="room-control-header-bar">
                <div className="room-control-header-left">
                  <button 
                    className="back-button"
                    onClick={() => navigate('/')}
                    title="返回楼层列表"
                  >
                    ← 返回
                  </button>
                  <div className="room-control-title">
                    <span className="breadcrumb-text">首页 / 设备列表</span>
                    {params.roomName && (
                      <>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-room">{params.roomName}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="room-control-header-right">
                  <div className="user-time-info">
                    <div className="user-info-item">
                      <UserIcon className="user-icon-small" />
                      <span className="user-name-text">张三</span>
                    </div>
                    <div className="time-info-item">
                      <span className="time-text">{formatTime(currentTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <RoomControl />
            </div>
          ) : (
            <MiddleColumn 
              showAIAnalysis={false} 
              showBuildingSelector={true}
              onFloorClick={(floor, roomCount, rooms) => {
                setSelectedFloor(floor)
                setSelectedFloorRoomCount(roomCount)
                setSelectedFloorRooms(rooms)
                setSelectedRoom(null) // 清除房间选择
                setStatisticsVisible(true) // 点击楼层时自动显示统计
              }}
              onRoomClick={(floor, roomName) => {
                setSelectedFloor(floor)
                setSelectedRoom(roomName)
                setSelectedFloorRoomCount(undefined) // 清除楼层统计
                setSelectedFloorRooms(undefined)
                setStatisticsVisible(true) // 点击房间时自动显示统计
              }}
              onFloorPlanClick={handleFloorPlanClick}
              onACFloorPlanClick={handleACFloorPlanClick}
              onLightFloorPlanClick={handleLightFloorPlanClick}
            />
          )}
        </div>
        <div className={`statistics-divider ${!statisticsVisible ? 'statistics-hidden' : ''}`}>
          <button
            className="statistics-toggle-btn"
            onClick={() => setStatisticsVisible(!statisticsVisible)}
            title={statisticsVisible ? '隐藏统计' : '显示统计'}
          >
            <span className={`toggle-arrow ${statisticsVisible ? 'down' : 'up'}`}>▼</span>
          </button>
        </div>
        {statisticsVisible && !showRoomControl && (
          <div className="home-statistics">
            <StatusStatistics 
              floor={selectedFloor || undefined} 
              roomCount={selectedFloorRoomCount}
              rooms={selectedFloorRooms}
              room={selectedRoom || undefined}
            />
          </div>
        )}
      </div>
      {/* 悬浮AI分析组件 - 从API获取数据 */}
      <FloatingAIAnalysis
        floor={isFloorMode ? selectedFloor || undefined : undefined}
        room={selectedRoom || undefined}
        days={7} // 默认查询近7天的数据
      />
      
      {/* 平面图组件 - 只在需要时显示，使用 key 强制重新渲染 */}
      {showFloorPlan && (
        <Suspense fallback={null}>
          <FloorPlan
            key={`floorplan-${floorPlanFloor}-${floorPlanRoom}`}
            isOpen={showFloorPlan}
            onClose={() => {
              setShowFloorPlan(false)
              setFloorPlanFloor(null)
              setFloorPlanRoom(null)
            }}
            floorName={floorPlanRoom ? `${floorPlanFloor} - ${floorPlanRoom}` : (floorPlanFloor || '平面图')}
            devices={getFloorPlanDevices()}
          />
        </Suspense>
      )}

      {/* 空调平面图组件 */}
      {showACFloorPlan && acFloorPlanFloor && (
        <Suspense fallback={null}>
          <ACFloorPlan
            key={`acfloorplan-${acFloorPlanFloor}`}
            isOpen={showACFloorPlan}
            onClose={() => {
              setShowACFloorPlan(false)
              setACFloorPlanFloor(null)
            }}
            floorName={acFloorPlanFloor}
            devices={getACFloorPlanDevices(acFloorPlanFloor)}
          />
        </Suspense>
      )}

      {/* 照明平面图组件 */}
      {showLightFloorPlan && lightFloorPlanFloor && (
        <Suspense fallback={null}>
          <LightFloorPlan
            key={`lightfloorplan-${lightFloorPlanFloor}`}
            isOpen={showLightFloorPlan}
            onClose={() => {
              setShowLightFloorPlan(false)
              setLightFloorPlanFloor(null)
            }}
            floorName={lightFloorPlanFloor}
            devices={getLightFloorPlanDevices(lightFloorPlanFloor)}
          />
        </Suspense>
      )}
    </div>
  )
}

export default HomePage

