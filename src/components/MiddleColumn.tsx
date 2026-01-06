import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LightOnIcon, PlugIcon, PersonIcon, EnergyIcon, PowerIcon, UserIcon, AirConditionerIcon } from './SmartBuildingIcons'
import AIAnalysis from './AIAnalysis'
import './MiddleColumn.css'

interface RoomData {
  floor: string
  name: string
  temperature: number
  energy: number
  power: number
  occupancy: string // 必需字段：统一显示"X时X分"格式的时间
  isOccupied: boolean // 是否有人：true=有人，false=无人
  acOn: boolean // 空调是否开启
  lightOn: boolean // 照明是否开启
  highlighted?: boolean // 当空调开启或照明开启时，但检测人员显示当前没有人，则框红框
}

// 房间类型列表
const roomTypes = [
  '机房', '技术室', '值班室', '办公室', '会议室', '储藏室', 
  '设备间', '配电室', '监控室', '档案室', '资料室', '休息室',
  '茶水间', '更衣室', '仓库', '维修室', '实验室', '培训室'
]

// 生成随机房间数据的函数
const generateRandomRoom = (floor: string, roomIndex: number): RoomData => {
  const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)]
  const roomNumber = String(roomIndex + 1).padStart(3, '0')
  const name = `${roomType}${roomNumber}`
  
  // 随机生成温度 (20-28度)
  const temperature = Math.floor(Math.random() * 9) + 20
  
  // 随机生成用电量 (3-40度)
  const energy = Math.round((Math.random() * 37 + 3) * 10) / 10
  
  // 随机生成功率 (30-50W)
  const power = Math.floor(Math.random() * 21) + 30
  
  // 随机生成占用时长 (0-4小时)
  const hours = Math.floor(Math.random() * 5)
  const minutes = Math.floor(Math.random() * 60)
  const occupancy = `${hours}时${minutes}分`
  
  // 随机生成是否有人 (70%概率有人)
  const isOccupied = Math.random() > 0.3
  
  // 随机生成空调状态 (50%概率开启)
  const acOn = Math.random() > 0.5
  
  // 随机生成照明状态 (50%概率开启)
  const lightOn = Math.random() > 0.5
  
  // 当空调开启或照明开启时，但检测人员显示当前没有人，则框红框
  const highlighted = (acOn || lightOn) && !isOccupied
  
  return {
    floor,
    name,
    temperature,
    energy,
    power,
    occupancy,
    isOccupied,
    acOn,
    lightOn,
    highlighted
  }
}

// 生成30个楼层的数据
const generateFloorData = (): RoomData[] => {
  const existingRooms: RoomData[] = [
    { floor: '3层', name: '董事长办公室', temperature: 26, energy: 23, power: 46, occupancy: '2时15分', isOccupied: true, acOn: true, lightOn: true },
    { floor: '3层', name: '销售副总经理室', temperature: 26, energy: 15.6, power: 50, occupancy: '1时30分', isOccupied: false, acOn: true, lightOn: false },
    { floor: '3层', name: '技术办公室', temperature: 27, energy: 12.3, power: 40, occupancy: '0时15分', isOccupied: true, acOn: true, lightOn: true },
    { floor: '3层', name: '人力资源部', temperature: 26, energy: 8.5, power: 46, occupancy: '3时10分', isOccupied: true, acOn: false, lightOn: true },
    { floor: '2层', name: '财务部', temperature: 24, energy: 22.3, power: 48, occupancy: '0时40分', isOccupied: true, acOn: true, lightOn: true },
    { floor: '2层', name: '档案管理室', temperature: 20, energy: 23, power: 44, occupancy: '3时20分', isOccupied: true, acOn: true, lightOn: false },
    { floor: '2层', name: '综合质量管理部门', temperature: 26, energy: 23.6, power: 50, occupancy: '2时45分', isOccupied: false, acOn: false, lightOn: true },
    { floor: '2层', name: '信息督察审核室', temperature: 26, energy: 14.6, power: 48, occupancy: '1时20分', isOccupied: false, acOn: false, lightOn: false },
    { floor: '1层', name: '综合管理办公室', temperature: 26, energy: 11.5, power: 50, occupancy: '3时15分', isOccupied: false, acOn: true, lightOn: false },
    { floor: '1层', name: '物资管理部', temperature: 26, energy: 13.6, power: 40, occupancy: '2时15分', isOccupied: true, acOn: false, lightOn: true },
    { floor: '1层', name: '综合部办公室', temperature: 26, energy: 11.8, power: 48, occupancy: '3时13分', isOccupied: true, acOn: true, lightOn: true },
    { floor: '1层', name: '信息中心室', temperature: 26, energy: 36.8, power: 40, occupancy: '2时11分', isOccupied: true, acOn: true, lightOn: true },
    { floor: '-1层', name: '储藏室', temperature: 26, energy: 6.8, power: 48, occupancy: '4时1分', isOccupied: true, acOn: false, lightOn: true },
    { floor: '-1层', name: '杂物间', temperature: 26, energy: 6.6, power: 50, occupancy: '0时25分', isOccupied: false, acOn: true, lightOn: false },
    { floor: '-1层', name: '设备机房', temperature: 26, energy: 18.2, power: 42, occupancy: '3时1分', isOccupied: true, acOn: true, lightOn: false },
    { floor: '-1层', name: '卫生间', temperature: 26, energy: 3.6, power: 50, occupancy: '0时2分', isOccupied: true, acOn: false, lightOn: true }
  ]
  
  // 按楼层分组现有房间
  const existingByFloor = existingRooms.reduce((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = []
    }
    acc[room.floor].push(room)
    return acc
  }, {} as Record<string, RoomData[]>)
  
  const allRooms: RoomData[] = []
  
  // 处理1-30层
  for (let floor = 1; floor <= 30; floor++) {
    const floorStr = `${floor}层`
    const existingFloorRooms = existingByFloor[floorStr] || []
    const needCount = 10 - existingFloorRooms.length
    
    // 添加现有房间
    allRooms.push(...existingFloorRooms)
    
    // 补充到10个房间
    for (let i = 0; i < needCount; i++) {
      allRooms.push(generateRandomRoom(floorStr, existingFloorRooms.length + i))
    }
  }
  
  // 处理-1层
  const floorStr = '-1层'
  const existingFloorRooms = existingByFloor[floorStr] || []
  const needCount = 10 - existingFloorRooms.length
  
  // 添加现有房间
  allRooms.push(...existingFloorRooms)
  
  // 补充到10个房间
  for (let i = 0; i < needCount; i++) {
    allRooms.push(generateRandomRoom(floorStr, existingFloorRooms.length + i))
  }
  
  // 重新计算所有房间的highlighted状态：当空调开启或照明开启时，但检测人员显示当前没有人，则框红框
  return allRooms.map(room => ({
    ...room,
    highlighted: (room.acOn || room.lightOn) && !room.isOccupied
  }))
}

const roomData: RoomData[] = generateFloorData()

interface MiddleColumnProps {
  showAIAnalysis?: boolean
  showBuildingSelector?: boolean
  showRoomActions?: boolean // 是否显示房间操作按钮（进入房间、平面图）
  showUserTimeInfo?: boolean // 是否显示用户和时间信息（默认true）
  onFloorClick?: (floor: string, roomCount: number, rooms: Array<{ name: string }>) => void // 楼层点击回调，传递楼层、房间数量和房间列表
  onRoomClick?: (floor: string, roomName: string) => void // 房间点击回调，传递楼层和房间名称
  onFloorPlanClick?: (floor: string, roomName: string) => void // 平面图点击回调，传递楼层和房间名称
  onACFloorPlanClick?: (floor: string) => void // 空调平面图点击回调，传递楼层
  onLightFloorPlanClick?: (floor: string) => void // 照明平面图点击回调，传递楼层
}

const MiddleColumn: React.FC<MiddleColumnProps> = ({ showAIAnalysis = true, showBuildingSelector = false, showRoomActions = true, showUserTimeInfo = true, onFloorClick, onRoomClick, onFloorPlanClick, onACFloorPlanClick, onLightFloorPlanClick }) => {
  const navigate = useNavigate()
  const [selectedBuilding, setSelectedBuilding] = useState('综合楼')
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

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
  
  const buildings = ['综合楼', '办公楼', '生产大楼']

  const groupedRooms = roomData.reduce((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = []
    }
    acc[room.floor].push(room)
    return acc
  }, {} as Record<string, RoomData[]>)

  // 计算每个楼层的总用电量和总功率，以及空调和照明的用电量和功率
  const floorStats = Object.entries(groupedRooms).map(([floor, rooms]) => {
    const totalEnergy = rooms.reduce((sum, room) => sum + room.energy, 0)
    const totalPower = rooms.reduce((sum, room) => sum + room.power, 0)
    
    // 计算空调的用电量和功率（只统计空调开启的房间）
    const acRooms = rooms.filter(room => room.acOn)
    const acEnergy = acRooms.reduce((sum, room) => sum + room.energy, 0)
    const acPower = acRooms.reduce((sum, room) => sum + room.power, 0)
    
    // 计算照明的用电量和功率（只统计照明开启的房间）
    const lightRooms = rooms.filter(room => room.lightOn)
    const lightEnergy = lightRooms.reduce((sum, room) => sum + room.energy, 0)
    const lightPower = lightRooms.reduce((sum, room) => sum + room.power, 0)
    
    return {
      floor,
      totalEnergy: totalEnergy.toFixed(1),
      totalPower: (totalPower / 1000).toFixed(1), // 转换为kW
      acEnergy: acEnergy.toFixed(1),
      acPower: (acPower / 1000).toFixed(1), // 转换为kW
      lightEnergy: lightEnergy.toFixed(1),
      lightPower: (lightPower / 1000).toFixed(1) // 转换为kW
    }
  })


  // 按楼层顺序排序（30层到-1层，从高到低）
  const sortedFloors = Array.from({ length: 30 }, (_, i) => `${30 - i}层`).concat(['-1层'])
  const sortedFloorStats = sortedFloors.map(floor => 
    floorStats.find(stat => stat.floor === floor) || { 
      floor, 
      totalEnergy: '0', 
      totalPower: '0',
      acEnergy: '0',
      acPower: '0',
      lightEnergy: '0',
      lightPower: '0'
    }
  )

  return (
    <div className="middle-column">
      <div className="column-title-row">
        <div className="column-title">状态概览</div>
        {showUserTimeInfo && (
          <div className="column-title-right">
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
        )}
      </div>
      {showBuildingSelector ? (
        <div className="building-selector">
          <select 
            className="building-select"
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
          >
            {buildings.map((building) => (
              <option key={building} value={building}>
                {building}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="building-name">综合楼</div>
      )}
      <div className="rooms-container">
        {sortedFloors.map((floor) => {
          const rooms = groupedRooms[floor] || []
          // 将红框房间（highlighted）排序到左边，红框房间按功率由大到小排序
          // 除了红框以外，按功率降序排列
          const sortedRooms = [...rooms].sort((a, b) => {
            // 红框房间优先
            if (a.highlighted && !b.highlighted) return -1
            if (!a.highlighted && b.highlighted) return 1
            // 如果都是红框房间，按功率由大到小排序
            if (a.highlighted && b.highlighted) {
              return b.power - a.power
            }
            // 如果都不是红框房间，按功率降序排列
            if (!a.highlighted && !b.highlighted) {
              return b.power - a.power
            }
            return 0
          })
          const floorStat = sortedFloorStats.find(stat => stat.floor === floor)
          return (
            <div 
              key={floor} 
              className={`floor-section ${selectedFloor === floor && !selectedRoom ? 'selected' : ''}`}
              onClick={() => {
                const floorRooms = groupedRooms[floor] || []
                setSelectedFloor(floor)
                setSelectedRoom(null) // 清除房间选择
                onFloorClick?.(
                  floor, 
                  floorRooms.length,
                  floorRooms.map(room => ({ name: room.name }))
                )
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="floor-summary">
                <div className="floor-number">{floor}</div>
                <div className="floor-metrics">
                  <div className="total-metrics-row">
                    <div className="floor-metric">
                      <EnergyIcon className="metric-icon" />
                      <span className="metric-value">{floorStat?.totalEnergy || '0'}度</span>
                    </div>
                    <div className="floor-metric">
                      <PowerIcon className="metric-icon circle-icon" />
                      <span className="metric-value">{floorStat?.totalPower || '0'}kW</span>
                    </div>
                  </div>
                  <div 
                    className="floor-metric clickable-metric"
                    onClick={(e) => {
                      e.stopPropagation()
                      onACFloorPlanClick?.(floor)
                    }}
                    style={{ cursor: 'pointer' }}
                    title="查看空调设备分布"
                  >
                    <AirConditionerIcon className="metric-icon" />
                    <span className="metric-value">{floorStat?.acEnergy || '0'}度 / {floorStat?.acPower || '0'}kW</span>
                  </div>
                  <div 
                    className="floor-metric clickable-metric"
                    onClick={(e) => {
                      e.stopPropagation()
                      onLightFloorPlanClick?.(floor)
                    }}
                    style={{ cursor: 'pointer' }}
                    title="查看照明设备分布"
                  >
                    <LightOnIcon className="metric-icon" />
                    <span className="metric-value">{floorStat?.lightEnergy || '0'}度 / {floorStat?.lightPower || '0'}kW</span>
                  </div>
                </div>
              </div>
              <div className="rooms-list">
                {sortedRooms.map((roomItem, index) => (
                  <div
                    key={index}
                    className={`room-card ${roomItem.highlighted ? 'highlighted' : ''} ${selectedRoom === roomItem.name ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation() // 阻止事件冒泡到楼层点击
                      setSelectedRoom(roomItem.name)
                      setSelectedFloor(floor)
                      onRoomClick?.(floor, roomItem.name)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="room-header">
                      <span className="room-name">{roomItem.name}</span>
                      <div className="room-icons">
                        {roomItem.lightOn && <LightOnIcon className="icon" />}
                        {roomItem.acOn && <PlugIcon className="icon" />}
                      </div>
                    </div>
                    <div className="room-details">
                      <div className="detail-item">
                        <span className="detail-label">室温</span>
                        <span className="detail-value">{roomItem.temperature}°C</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">用电量</span>
                        <span className="detail-value">{roomItem.energy}度</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">总功率</span>
                        <span className="detail-value">{roomItem.power}W</span>
                      </div>
                      <div className="detail-item occupancy">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <PersonIcon className={`icon ${!roomItem.isOccupied ? 'inactive' : ''}`} isOccupied={roomItem.isOccupied} />
                          <span className="detail-value">{roomItem.occupancy}</span>
                        </div>
                        {showRoomActions && (
                          <div className="room-actions">
                            <button 
                              className="room-action-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                // 跳转到房间控制页面
                                navigate(`/room-control/${encodeURIComponent(floor)}/${encodeURIComponent(roomItem.name)}`)
                              }}
                              title="进入房间"
                            >
                              <img src="/智慧楼宇图标/首页/进入房间.png" alt="进入房间" style={{ width: '14px', height: '14px' }} />
                            </button>
                            <button 
                              className="room-action-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                onFloorPlanClick?.(floor, roomItem.name)
                              }}
                              title="平面图"
                            >
                              <img src="/智慧楼宇图标/首页/平面图.png" alt="平面图" style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      {showAIAnalysis && (
        <div className="ai-analysis-wrapper">
          <AIAnalysis />
        </div>
      )}
    </div>
  )
}

export default MiddleColumn
