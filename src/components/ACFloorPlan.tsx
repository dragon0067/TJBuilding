import React, { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import ReactECharts from 'echarts-for-react'
import styles from './FloorPlan.module.css'
import { Device, DeviceType, DeviceStatus } from './FloorPlan'

interface ACFloorPlanProps {
  isOpen: boolean
  onClose: () => void
  floorName?: string // 楼层名称
  floorPlanImage?: string // 平面图图片路径，如果不提供则使用默认占位图
  devices?: Device[] // 设备列表（只显示空调设备）
}

// 设备图标映射
const getDeviceIcon = (type: DeviceType, status: DeviceStatus): string => {
  const iconMap: Record<DeviceType, Record<DeviceStatus, string>> = {
    airConditioner: {
      on: '/智慧楼宇图标/设备列表/空调 开.png',
      off: '/智慧楼宇图标/设备列表/空调关.png'
    },
    light: {
      on: '/智慧楼宇图标/设备列表/照明灯开.png',
      off: '/智慧楼宇图标/设备列表/照明灯关.png'
    },
    socket: {
      on: '/智慧楼宇图标/设备列表/插座开.png',
      off: '/智慧楼宇图标/设备列表/插座关.png'
    },
    computer: {
      on: '/智慧楼宇图标/设备列表/电脑开.png',
      off: '/智慧楼宇图标/设备列表/电脑关.png'
    },
    projector: {
      on: '/智慧楼宇图标/设备列表/投影仪开.png',
      off: '/智慧楼宇图标/设备列表/投影仪关.png'
    }
  }
  return iconMap[type]?.[status] || iconMap.airConditioner.off
}

// 设备类型中文名称
const getDeviceTypeName = (type: DeviceType): string => {
  const nameMap: Record<DeviceType, string> = {
    airConditioner: '空调',
    light: '照明灯',
    socket: '插座',
    computer: '电脑',
    projector: '投影仪'
  }
  return nameMap[type] || '设备'
}

const ACFloorPlan: React.FC<ACFloorPlanProps> = ({
  isOpen,
  onClose,
  floorName = '平面图',
  floorPlanImage,
  devices = []
}) => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null) // 选中的房间名称
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [filterStatus, setFilterStatus] = useState<'all' | 'on' | 'off'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'power' | 'room'>('name')
  const [devicesState, setDevicesState] = useState<Map<string, DeviceStatus>>(new Map())
  const initializedRef = useRef(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // 存储每个设备的故障监测数据，避免每次渲染都重新生成
  const deviceFaultDataRef = useRef<Map<string, {
    faultType: 'none' | 'noCooling' | 'powerOverload' | 'temperatureAbnormal' | 'operationAbnormal'
    faultLevel: number // 故障等级 0-100
    faultHistory: Array<{ time: string; value: number }> // 24小时故障监测数据
  }>>(new Map())
  // 存储每个设备的维护建议数据
  const maintenanceDataRef = useRef<Map<string, {
    maintenanceLevel: 'normal' | 'warning' | 'urgent'
    maintenanceSuggestion: string
    predictedFault: string
  }>>(new Map())
  // 存储每个设备的运行时长数据
  const deviceRuntimeDataRef = useRef<Map<string, {
    runtimeHours: number
    timeSlots: string[]
  }>>(new Map())
  // 存储每个房间的面积数据，避免每次重新生成
  const roomAreaDataRef = useRef<Map<string, number>>(new Map())

  // 初始化设备状态（只在首次加载时初始化，之后保留用户修改的状态）
  useEffect(() => {
    if (!initializedRef.current) {
      // 首次加载时初始化所有设备状态
      const stateMap = new Map<string, DeviceStatus>()
      devices.forEach(device => {
        stateMap.set(device.id, device.status)
      })
      setDevicesState(stateMap)
      initializedRef.current = true
    } else {
      // 后续只添加新设备，保留现有设备的状态
      setDevicesState(prevState => {
        const newStateMap = new Map(prevState)
        devices.forEach(device => {
          if (!newStateMap.has(device.id)) {
            newStateMap.set(device.id, device.status)
          }
        })
        // 移除不存在的设备
        const currentDeviceIds = new Set(devices.map(d => d.id))
        Array.from(newStateMap.keys()).forEach(id => {
          if (!currentDeviceIds.has(id)) {
            newStateMap.delete(id)
          }
        })
        return newStateMap
      })
    }
  }, [devices])

  // 只显示空调设备，并使用最新状态
  const allACDevices = devices
    .filter(device => device.type === 'airConditioner')
    .map(device => ({
      ...device,
      status: devicesState.get(device.id) || device.status
    }))
  
  // 按状态筛选
  const filteredDevices = filterStatus === 'all' 
    ? allACDevices 
    : allACDevices.filter(device => device.status === filterStatus)
  
  // 排序
  const sortedDevices = [...filteredDevices].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name, 'zh-CN')
    } else if (sortBy === 'power') {
      return (b.power || 0) - (a.power || 0)
    } else if (sortBy === 'room') {
      return (a.room || '').localeCompare(b.room || '', 'zh-CN')
    }
    return 0
  })

  // 统计信息（使用最新状态）
  const stats = {
    total: allACDevices.length,
    on: allACDevices.filter(d => {
      const currentStatus = devicesState.get(d.id) || d.status
      return currentStatus === 'on'
    }).length,
    off: allACDevices.filter(d => {
      const currentStatus = devicesState.get(d.id) || d.status
      return currentStatus === 'off'
    }).length,
    totalPower: allACDevices.reduce((sum, d) => sum + (d.power || 0), 0),
    onPower: allACDevices.filter(d => {
      const currentStatus = devicesState.get(d.id) || d.status
      return currentStatus === 'on'
    }).reduce((sum, d) => sum + (d.power || 0), 0)
  }

  // 生成故障监测数据（24小时数据，使用设备ID作为种子确保每次生成相同）
  // 确保至少有一两台设备有故障
  const generateFaultData = (deviceId: string, deviceIndex: number, totalDevices: number, firstDeviceId?: string): {
    faultType: 'none' | 'noCooling' | 'powerOverload' | 'temperatureAbnormal' | 'operationAbnormal'
    faultLevel: number
    faultHistory: Array<{ time: string; value: number }>
  } => {
    // 使用设备ID生成伪随机数，确保每次相同
    const seed = deviceId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const pseudoRandom = (seed % 100) / 100
    
    // 生成故障类型（确保至少有一两台设备有故障）
    const faultTypes: Array<'none' | 'noCooling' | 'powerOverload' | 'temperatureAbnormal' | 'operationAbnormal'> = 
      ['none', 'noCooling', 'powerOverload', 'temperatureAbnormal', 'operationAbnormal']
    
    let faultType: 'none' | 'noCooling' | 'powerOverload' | 'temperatureAbnormal' | 'operationAbnormal'
    
    // 确保前两台设备中至少有一台有故障，或者根据伪随机数分配故障
    if (totalDevices >= 2) {
      // 前两台设备中至少有一台有故障
      if (deviceIndex === 0) {
        // 第一台设备：60%概率有故障
        faultType = pseudoRandom < 0.6 ? faultTypes[Math.floor((seed % 4) + 1)] : 'none'
      } else if (deviceIndex === 1) {
        // 第二台设备：如果第一台正常，则这台必须有故障；否则随机
        if (firstDeviceId) {
          // 获取第一台设备的故障数据来判断
          const firstFaultData = deviceFaultDataRef.current.get(firstDeviceId)
          if (firstFaultData && firstFaultData.faultType === 'none') {
            // 第一台正常，这台必须有故障
            faultType = faultTypes[Math.floor((seed % 4) + 1)]
          } else {
            // 第一台有故障，这台随机
            faultType = pseudoRandom < 0.3 ? faultTypes[Math.floor((seed % 4) + 1)] : 'none'
          }
        } else {
          // 如果没有第一台设备ID，使用简单的策略
          faultType = pseudoRandom < 0.5 ? faultTypes[Math.floor((seed % 4) + 1)] : 'none'
        }
      } else {
        // 其他设备：20%概率有故障
        faultType = pseudoRandom < 0.2 ? faultTypes[Math.floor((seed % 4) + 1)] : 'none'
      }
    } else {
      // 设备数量少于2台，随机分配
      faultType = pseudoRandom < 0.3 ? faultTypes[Math.floor((seed % 4) + 1)] : 'none'
    }
    
    // 生成24小时数据（每小时一个点）
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const faultHistory = hours.map((hour, index) => {
      const time = `${String(hour).padStart(2, '0')}:00`
      // 使用小时索引和设备ID生成伪随机数
      const hourSeed = (seed + index * 17) % 100
      const hourRandom = hourSeed / 100
      let value = 0
      
      if (faultType === 'none') {
        // 正常情况，值在0-20之间波动
        value = hourRandom * 20
      } else if (faultType === 'noCooling') {
        // 无法制冷，值在60-100之间
        value = 60 + hourRandom * 40
      } else if (faultType === 'powerOverload') {
        // 功率过大，值在70-100之间
        value = 70 + hourRandom * 30
      } else if (faultType === 'temperatureAbnormal') {
        // 温度异常，值在50-90之间
        value = 50 + hourRandom * 40
      } else if (faultType === 'operationAbnormal') {
        // 运行异常，值在40-80之间
        value = 40 + hourRandom * 40
      }
      
      return { time, value: Math.round(value) }
    })
    
    // 计算平均故障等级
    const faultLevel = Math.round(faultHistory.reduce((sum, item) => sum + item.value, 0) / faultHistory.length)
    
    return {
      faultType,
      faultLevel,
      faultHistory
    }
  }

  // 计算各房间的数据
  const roomData = useMemo(() => {
    const roomMap = new Map<string, {
      total: number
      on: number
      totalPower: number
      onPower: number
      devices: Device[]
    }>()

    allACDevices.forEach(device => {
      const room = device.room || '未分组'
      const currentStatus = devicesState.get(device.id) || device.status
      
      if (!roomMap.has(room)) {
        roomMap.set(room, {
          total: 0,
          on: 0,
          totalPower: 0,
          onPower: 0,
          devices: []
        })
      }
      
      const roomInfo = roomMap.get(room)!
      roomInfo.total++
      roomInfo.devices.push(device)
      roomInfo.totalPower += device.power || 0
      
      if (currentStatus === 'on') {
        roomInfo.on++
        roomInfo.onPower += device.power || 0
      }
    })

    // 为每个房间生成面积数据（模拟数据，根据设备数量估算）
    // 使用ref存储，确保只生成一次
    return Array.from(roomMap.entries()).map(([room, info]) => {
      // 如果还没有为该房间生成面积，则生成一个（20-100平方米）
      if (!roomAreaDataRef.current.has(room)) {
        // 根据设备数量估算面积：每个设备大约需要15-30平方米
        // 使用固定的种子值确保每次生成相同（基于房间名称和设备数量）
        const seed = room.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + info.total
        const pseudoRandom = (seed % 100) / 100 // 伪随机数，基于房间名称和设备数量
        const baseArea = 20 + (info.total * 15) + pseudoRandom * 20
        roomAreaDataRef.current.set(room, Math.round(baseArea))
      }
      
      const area = roomAreaDataRef.current.get(room)!
      // 用电量（度）= 功率(W) * 运行时长(h) / 1000
      // 假设平均运行时长为当天运行时长（模拟数据）
      const runtimeHours = info.on > 0 ? (info.on / info.total * 8) : 0
      let baseEnergyConsumption = (info.onPower * runtimeHours / 1000) // 度
      
      // 计算故障设备的额外能耗
      // 先确保所有设备的故障数据都已生成（无论设备是否开启，都要生成故障数据）
      // 需要按顺序生成以确保第二台设备能正确判断第一台设备的状态
      info.devices.forEach((device, deviceIndex) => {
        if (!deviceFaultDataRef.current.has(device.id)) {
          // 对于第二台设备，需要先检查第一台设备的状态
          const firstDeviceId = deviceIndex === 1 && info.devices.length >= 2 ? info.devices[0].id : undefined
          if (firstDeviceId && !deviceFaultDataRef.current.has(firstDeviceId)) {
            // 先生成第一台设备的故障数据（无论是否开启）
            const firstFaultData = generateFaultData(firstDeviceId, 0, info.devices.length)
            deviceFaultDataRef.current.set(firstDeviceId, firstFaultData)
          }
          // 生成当前设备的故障数据（无论是否开启）
          const faultData = generateFaultData(device.id, deviceIndex, info.devices.length, firstDeviceId)
          deviceFaultDataRef.current.set(device.id, faultData)
        }
      })
      
      let totalEnergyMultiplier = 0
      let faultDeviceCount = 0
      // 只计算开启设备的能耗倍数
      info.devices.forEach((device, deviceIndex) => {
        const currentStatus = devicesState.get(device.id) || device.status
        if (currentStatus === 'on') {
          const faultData = deviceFaultDataRef.current.get(device.id)!
          
          if (faultData.faultType !== 'none') {
            faultDeviceCount++
            // 根据故障类型计算能耗倍数
            let multiplier = 1.0
            if (faultData.faultType === 'powerOverload') {
              multiplier = 1.5 + (faultData.faultLevel / 100) * 0.5
            } else if (faultData.faultType === 'noCooling') {
              multiplier = 1.3 + (faultData.faultLevel / 100) * 0.3
            } else if (faultData.faultType === 'temperatureAbnormal') {
              multiplier = 1.2 + (faultData.faultLevel / 100) * 0.3
            } else if (faultData.faultType === 'operationAbnormal') {
              multiplier = 1.25 + (faultData.faultLevel / 100) * 0.3
            }
            totalEnergyMultiplier += multiplier
          } else {
            totalEnergyMultiplier += 1.0
          }
        }
      })
      
      // 计算平均能耗倍数
      const avgEnergyMultiplier = info.on > 0 ? (totalEnergyMultiplier / info.on) : 1.0
      const energyConsumption = baseEnergyConsumption * avgEnergyMultiplier
      
      // 单位制冷耗电量 = 用电量(度) / 面积(m²)
      const energyPerSquareMeter = area > 0 ? (energyConsumption / area) : 0
      
      // 能耗成本 = 用电量 * 0.6元/度
      const energyCost = (energyConsumption * 0.6).toFixed(2)
      
      return {
        room,
        lightRate: info.total > 0 ? (info.on / info.total * 100) : 0, // 开启率（%）
        avgRuntime: runtimeHours, // 平均运行时长（小时）
        energyCost: energyCost, // 能耗成本（元，考虑故障设备的额外成本）
        totalDevices: info.total,
        onDevices: info.on,
        area: area, // 面积（m²）
        energyConsumption: energyConsumption, // 用电量（度，考虑故障设备的额外能耗）
        energyPerSquareMeter: energyPerSquareMeter // 单位制冷耗电量（度/m²）
      }
    })
  }, [allACDevices, devicesState])

  // 计算所有房间的平均开启率
  const averageLightRate = useMemo(() => {
    if (roomData.length === 0) return 0
    const totalRate = roomData.reduce((sum, room) => sum + room.lightRate, 0)
    return totalRate / roomData.length
  }, [roomData])

  // 计算所有房间的平均能耗成本
  const averageEnergyCost = useMemo(() => {
    if (roomData.length === 0) return 0
    const totalCost = roomData.reduce((sum, room) => sum + parseFloat(room.energyCost), 0)
    return totalCost / roomData.length
  }, [roomData])

  // 处理饼图点击事件
  const handlePieChartClick = (params: any) => {
    if (params && params.name) {
      setSelectedRoom(params.name)
    }
  }

  // 获取选中房间的详细信息
  const selectedRoomData = useMemo(() => {
    if (!selectedRoom) return null
    return roomData.find(r => r.room === selectedRoom) || null
  }, [selectedRoom, roomData])

  // 获取选中房间的所有空调设备
  const selectedRoomDevices = useMemo(() => {
    if (!selectedRoom) return []
    return allACDevices.filter(device => device.room === selectedRoom)
  }, [selectedRoom, allACDevices])

  // 获取故障类型中文名称
  const getFaultTypeName = (faultType: string): string => {
    const nameMap: Record<string, string> = {
      none: '正常',
      noCooling: '无法制冷',
      powerOverload: '功率过大',
      temperatureAbnormal: '温度异常',
      operationAbnormal: '运行异常'
    }
    return nameMap[faultType] || '未知'
  }

  // 生成时间段数组（使用设备ID作为种子，确保每次生成相同）
  const generateTimeSlots = (runtimeHours: number, deviceId: string): string[] => {
    const slots: string[] = []
    // 使用设备ID生成伪随机数，确保每次相同
    const seed = deviceId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const pseudoRandom = (seed % 100) / 100
    const startHour = Math.floor(pseudoRandom * (24 - runtimeHours))
    for (let i = 0; i < runtimeHours; i++) {
      const hour = (startHour + i) % 24
      slots.push(`${String(hour).padStart(2, '0')}:00`)
    }
    return slots
  }

  // 生成故障监测折线图配置（用于表格单元格）
  const getFaultChartOption = (faultHistory: Array<{ time: string; value: number }>, faultLevel: number) => {
    const times = faultHistory.map(item => item.time)
    const values = faultHistory.map(item => item.value)
    
    // 根据故障等级确定颜色
    let lineColor = '#4CAF50' // 正常 - 绿色
    let areaColor = 'rgba(76, 175, 80, 0.1)'
    
    if (faultLevel >= 60) {
      lineColor = '#F44336' // 严重 - 红色
      areaColor = 'rgba(244, 67, 54, 0.1)'
    } else if (faultLevel >= 30) {
      lineColor = '#FFC107' // 警告 - 黄色
      areaColor = 'rgba(255, 193, 7, 0.1)'
    }
    
    return {
      grid: {
        left: '5%',
        right: '5%',
        top: '10%',
        bottom: '10%',
        containLabel: false
      },
      xAxis: {
        type: 'category',
        data: times,
        show: false,
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        show: false,
        min: 0,
        max: 100
      },
      series: [
        {
          type: 'line',
          data: values,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: lineColor,
            width: 2
          },
          areaStyle: {
            color: areaColor
          }
        }
      ],
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const param = params[0]
          return `${param.name}<br/>故障等级: ${param.value}`
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: lineColor,
        borderWidth: 1,
        textStyle: {
          color: '#fff',
          fontSize: 11
        }
      }
    }
  }

  // 计算设备详情数据（当天数据）
  const deviceDetailData = useMemo(() => {
    return selectedRoomDevices.map((device, index) => {
      const currentStatus = devicesState.get(device.id) || device.status
      const power = device.power || 0
      
      // 生成或获取故障监测数据
      if (!deviceFaultDataRef.current.has(device.id)) {
        const firstDeviceId = index === 1 && selectedRoomDevices.length >= 2 ? selectedRoomDevices[0].id : undefined
        if (firstDeviceId && !deviceFaultDataRef.current.has(firstDeviceId)) {
          const firstFaultData = generateFaultData(firstDeviceId, 0, selectedRoomDevices.length)
          deviceFaultDataRef.current.set(firstDeviceId, firstFaultData)
        }
        const faultData = generateFaultData(device.id, index, selectedRoomDevices.length, firstDeviceId)
        deviceFaultDataRef.current.set(device.id, faultData)
      }
      
      const faultData = deviceFaultDataRef.current.get(device.id)!
      
      // 如果设备未开启，用电量为0
      // 使用设备ID生成伪随机运行时长，确保每次相同
      const seed = device.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const pseudoRandom = (seed % 100) / 100
      const runtimeHours = currentStatus === 'on' ? (pseudoRandom * 7 + 1) : 0
      
      // 计算基础用电量 = 功率(W) * 时长(h) / 1000 (转换为度)
      let baseEnergyConsumption = power * runtimeHours / 1000
      
      // 如果设备有故障，增加能耗（故障设备通常能耗更高）
      let energyMultiplier = 1.0 // 能耗倍数
      if (faultData.faultType !== 'none') {
        if (faultData.faultType === 'powerOverload') {
          // 功率过大：能耗增加50-100%
          energyMultiplier = 1.5 + (faultData.faultLevel / 100) * 0.5 // 1.5-2.0倍
        } else if (faultData.faultType === 'noCooling') {
          // 无法制冷：能耗增加30-60%（需要更长时间运行）
          energyMultiplier = 1.3 + (faultData.faultLevel / 100) * 0.3 // 1.3-1.6倍
        } else if (faultData.faultType === 'temperatureAbnormal') {
          // 温度异常：能耗增加20-50%
          energyMultiplier = 1.2 + (faultData.faultLevel / 100) * 0.3 // 1.2-1.5倍
        } else if (faultData.faultType === 'operationAbnormal') {
          // 运行异常：能耗增加25-55%
          energyMultiplier = 1.25 + (faultData.faultLevel / 100) * 0.3 // 1.25-1.55倍
        }
      }
      
      const energyConsumption = (baseEnergyConsumption * energyMultiplier).toFixed(2)
      // 能耗成本 = 用电量 * 0.6元/度
      const cost = (parseFloat(energyConsumption) * 0.6).toFixed(2)
      
      return {
        index: index + 1,
        deviceName: device.name,
        ratedPower: power,
        faultType: faultData.faultType,
        faultLevel: faultData.faultLevel,
        faultHistory: faultData.faultHistory,
        energyConsumption,
        cost
      }
    })
  }, [selectedRoomDevices, devicesState])

  // 生成维护建议数据
  const maintenanceData = useMemo(() => {
    return selectedRoomDevices.map((device, index) => {
      const currentData = deviceDetailData[index]
      
      // 如果还没有生成维护建议数据，则生成并存储
      if (!maintenanceDataRef.current.has(device.id)) {
        const faultLevel = currentData.faultLevel
        let maintenanceLevel: 'normal' | 'warning' | 'urgent'
        let maintenanceSuggestion: string
        let predictedFault: string
        
        const faultType = currentData.faultType
        
        if (faultType === 'none') {
          maintenanceLevel = 'normal'
          maintenanceSuggestion = '设备运行正常，建议定期检查'
          predictedFault = '无故障风险'
        } else if (faultLevel < 60) {
          maintenanceLevel = 'warning'
          if (faultType === 'noCooling') {
            maintenanceSuggestion = '设备制冷效果下降，能耗增加30-60%，建议检查制冷系统'
            predictedFault = '制冷功能可能进一步恶化'
          } else if (faultType === 'powerOverload') {
            maintenanceSuggestion = '设备功率异常，能耗增加50-100%，建议检查电路和压缩机'
            predictedFault = '功率超载可能导致设备损坏'
          } else if (faultType === 'temperatureAbnormal') {
            maintenanceSuggestion = '设备温度控制异常，能耗增加20-50%，建议检查温控系统'
            predictedFault = '温度控制可能失效'
          } else if (faultType === 'operationAbnormal') {
            maintenanceSuggestion = '设备运行异常，能耗增加25-55%，建议检查运行状态'
            predictedFault = '运行异常可能加剧'
          } else {
            maintenanceSuggestion = '设备存在轻微异常，建议近期检查'
            predictedFault = '运行状态需关注'
          }
        } else {
          maintenanceLevel = 'urgent'
          if (faultType === 'noCooling') {
            maintenanceSuggestion = '设备无法制冷，能耗异常升高，建议立即检修制冷系统，避免进一步损坏'
            predictedFault = '制冷功能可能完全失效，设备可能过热'
          } else if (faultType === 'powerOverload') {
            maintenanceSuggestion = '设备功率严重超载，能耗异常升高，建议立即断电检修，防止设备损坏或引发安全事故'
            predictedFault = '功率超载可能导致设备烧毁或引发火灾'
          } else if (faultType === 'temperatureAbnormal') {
            maintenanceSuggestion = '设备温度控制严重异常，能耗异常升高，建议立即检查温控系统和传感器'
            predictedFault = '温度控制失效可能导致设备损坏或环境不适'
          } else if (faultType === 'operationAbnormal') {
            maintenanceSuggestion = '设备运行严重异常，能耗异常升高，建议立即停机检修，避免设备损坏'
            predictedFault = '运行异常可能导致设备完全失效'
          } else {
            maintenanceSuggestion = '设备故障风险较高，建议立即检修'
            predictedFault = '故障可能加剧'
          }
        }
        
        maintenanceDataRef.current.set(device.id, {
          maintenanceLevel,
          maintenanceSuggestion,
          predictedFault
        })
      }
      
      return {
        index: index + 1,
        deviceName: device.name,
        ...maintenanceDataRef.current.get(device.id)!
      }
    })
  }, [selectedRoomDevices, deviceDetailData])

  // 计算所有开启设备的平均运行时长（关闭不计算）
  const averageRuntime = useMemo(() => {
    const onDevices = allACDevices.filter(device => {
      const currentStatus = devicesState.get(device.id) || device.status
      return currentStatus === 'on'
    })
    
    if (onDevices.length === 0) return 0
    
    // 确保所有开启设备的数据都已生成
    onDevices.forEach(device => {
      if (!deviceRuntimeDataRef.current.has(device.id)) {
        // 使用设备ID生成伪随机数，确保每次相同
        const seed = device.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const pseudoRandom = (seed % 100) / 100
        const runtimeHours = pseudoRandom * 7 + 1
        const timeSlots = generateTimeSlots(runtimeHours, device.id)
        deviceRuntimeDataRef.current.set(device.id, { runtimeHours, timeSlots })
      }
    })
    
    // 获取所有开启设备的运行时长
    const runtimeHours = onDevices.map(device => {
      return deviceRuntimeDataRef.current.get(device.id)!.runtimeHours
    }).filter(hours => hours > 0)
    
    if (runtimeHours.length === 0) return 0
    
    const totalHours = runtimeHours.reduce((sum, hours) => sum + hours, 0)
    return totalHours / runtimeHours.length
  }, [allACDevices, devicesState])

  // 区域能效概览柱状图配置
  const energyEfficiencyBarOption = useMemo(() => {
    // 按单位制冷耗电量排序
    const sortedRooms = [...roomData].sort((a, b) => b.energyPerSquareMeter - a.energyPerSquareMeter)
    
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const param = params[0]
          const room = sortedRooms[param.dataIndex]
          return `${param.name}<br/>` +
                 `单位制冷耗电量: ${param.value.toFixed(2)} 度/m²<br/>` +
                 `用电量: ${room.energyConsumption.toFixed(2)} 度<br/>` +
                 `面积: ${room.area} m²`
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#3E7BFA',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
          fontSize: 11
        }
      },
      grid: {
        left: '15%',
        right: '5%',
        bottom: '10%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '用电量/m²',
        nameLocation: 'end',
        nameGap: 10,
        nameTextStyle: {
          color: '#999',
          fontSize: 11
        },
        axisLine: {
          lineStyle: {
            color: '#3E7BFA'
          }
        },
        axisLabel: {
          color: '#fff',
          fontSize: 10
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)',
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: sortedRooms.map(r => r.room),
        axisLine: {
          lineStyle: {
            color: '#3E7BFA'
          }
        },
        axisLabel: {
          color: '#fff',
          fontSize: 10
        }
      },
      series: [
        {
          type: 'bar',
          data: sortedRooms.map(r => parseFloat(r.energyPerSquareMeter.toFixed(2))),
          itemStyle: {
            color: (params: any) => {
              const value = params.value
              // 根据单位制冷耗电量值设置颜色
              if (value >= 0.5) {
                return '#F44336' // 高耗能 - 红色
              } else if (value >= 0.3) {
                return '#FFC107' // 中等耗能 - 黄色
              } else {
                return '#4CAF50' // 低耗能 - 绿色
              }
            },
            borderRadius: [0, 4, 4, 0]
          },
          label: {
            show: true,
            position: 'right',
            color: '#fff',
            fontSize: 10,
            formatter: '{c}'
          }
        }
      ]
    }
  }, [roomData])
  
  // 计算平均单位制冷耗电量
  const averageEnergyPerSquareMeter = useMemo(() => {
    if (roomData.length === 0) return 0
    const total = roomData.reduce((sum, room) => sum + room.energyPerSquareMeter, 0)
    return total / roomData.length
  }, [roomData])

  // 故障监测折线图配置（显示每个设备的故障监测数据）
  const faultMonitoringLineOption = useMemo(() => {
    // 确保所有设备的故障数据都已生成
    allACDevices.forEach((device, index) => {
      if (!deviceFaultDataRef.current.has(device.id)) {
        const firstDeviceId = index === 1 && allACDevices.length >= 2 ? allACDevices[0].id : undefined
        if (firstDeviceId && !deviceFaultDataRef.current.has(firstDeviceId)) {
          const firstFaultData = generateFaultData(firstDeviceId, 0, allACDevices.length)
          deviceFaultDataRef.current.set(firstDeviceId, firstFaultData)
        }
        const faultData = generateFaultData(device.id, index, allACDevices.length, firstDeviceId)
        deviceFaultDataRef.current.set(device.id, faultData)
      }
    })
    
    // 获取24小时时间点
    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
    
    // 定义颜色数组，用于区分不同设备
    const colorPalette = [
      '#3E7BFA', '#4CAF50', '#F96418', '#FFC107', '#9C27B0', 
      '#00BCD4', '#FF5722', '#795548', '#607D8B', '#E91E63',
      '#2196F3', '#009688', '#FF9800', '#673AB7', '#CDDC39'
    ]
    
    // 辅助函数：将十六进制颜色转换为rgba
    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    
    // 为每个设备创建一条折线
    const series = allACDevices.map((device, index) => {
      const faultData = deviceFaultDataRef.current.get(device.id)!
      const values = faultData.faultHistory.map(item => item.value)
      const color = colorPalette[index % colorPalette.length]
      
      // 根据设备的平均故障等级确定是否使用区域填充
      const avgFaultLevel = faultData.faultLevel
      const useAreaStyle = avgFaultLevel >= 60 // 只有严重故障的设备才显示区域填充
      
      return {
        name: device.name,
        type: 'line',
        data: values,
        smooth: true,
        symbol: 'circle',
        symbolSize: 3,
        lineStyle: {
          color: color,
          width: 1.5
        },
        itemStyle: {
          color: color
        },
        areaStyle: useAreaStyle ? {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: hexToRgba(color, 0.3) },
              { offset: 1, color: hexToRgba(color, 0) }
            ]
          }
        } : undefined,
        label: {
          show: false
        }
      }
    })
    
    // 获取设备名称列表用于图例
    const legendData = allACDevices.map(device => device.name)
    
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#3E7BFA',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
          fontSize: 11
        }
      },
      legend: {
        data: legendData,
        bottom: '2%',
        textStyle: {
          color: '#fff',
          fontSize: 9
        },
        type: 'scroll',
        orient: 'horizontal',
        itemGap: 8,
        itemWidth: 12,
        itemHeight: 8,
        left: 'center'
      },
      grid: {
        left: '8%',
        right: '5%',
        bottom: '15%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: hours,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#3E7BFA'
          }
        },
        axisLabel: {
          color: '#fff',
          fontSize: 10,
          rotate: 45,
          interval: 2 // 每2个显示一个，避免过于拥挤
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        name: '故障等级',
        nameTextStyle: {
          color: '#999',
          fontSize: 11
        },
        min: 0,
        max: 100,
        axisLine: {
          lineStyle: {
            color: '#3E7BFA'
          }
        },
        axisLabel: {
          color: '#fff',
          fontSize: 10
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)',
            type: 'dashed'
          }
        }
      },
      series: series
    }
  }, [allACDevices])
  
  // 计算平均故障等级（用于显示在右上角）
  const averageFaultLevel = useMemo(() => {
    if (allACDevices.length === 0) return 0
    
    // 确保所有设备的故障数据都已生成
    allACDevices.forEach((device, index) => {
      if (!deviceFaultDataRef.current.has(device.id)) {
        const firstDeviceId = index === 1 && allACDevices.length >= 2 ? allACDevices[0].id : undefined
        if (firstDeviceId && !deviceFaultDataRef.current.has(firstDeviceId)) {
          const firstFaultData = generateFaultData(firstDeviceId, 0, allACDevices.length)
          deviceFaultDataRef.current.set(firstDeviceId, firstFaultData)
        }
        const faultData = generateFaultData(device.id, index, allACDevices.length, firstDeviceId)
        deviceFaultDataRef.current.set(device.id, faultData)
      }
    })
    
    let totalFaultLevel = 0
    let count = 0
    
    deviceFaultDataRef.current.forEach((faultData) => {
      totalFaultLevel += faultData.faultLevel
      count++
    })
    
    return count > 0 ? Math.round(totalFaultLevel / count) : 0
  }, [allACDevices])

  // 能耗成本对比柱状图配置
  const energyCostBarOption = useMemo(() => {
    const sortedRooms = [...roomData].sort((a, b) => parseFloat(b.energyCost) - parseFloat(a.energyCost))
    
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: '{b}: {c}元'
      },
      grid: {
        left: '15%',
        right: '5%',
        bottom: '10%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '元',
        nameTextStyle: {
          color: '#999'
        },
        axisLine: {
          lineStyle: {
            color: '#F96418'
          }
        },
        axisLabel: {
          color: '#fff'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: sortedRooms.map(r => r.room),
        axisLine: {
          lineStyle: {
            color: '#F96418'
          }
        },
        axisLabel: {
          color: '#fff',
          fontSize: 11
        }
      },
      series: [
        {
          type: 'bar',
          data: sortedRooms.map(r => parseFloat(r.energyCost)),
          itemStyle: {
            color: '#F96418'
          },
          label: {
            show: true,
            position: 'right',
            color: '#fff',
            formatter: '{c}元'
          }
        }
      ]
    }
  }, [roomData])

  // 默认平面图（如果没有提供）
  const defaultImage = '' // 不显示默认图片
  const imageSrc = floorPlanImage || defaultImage

  // 监听图片加载
  useEffect(() => {
    if (!imageSrc) {
      // 如果没有图片，直接设置为已加载状态
      setImageLoaded(true)
      return
    }
    if (imageRef.current && imageRef.current.complete) {
      handleImageLoad()
    }
  }, [isOpen, imageSrc])

  const handleImageLoad = () => {
    if (imageRef.current) {
      const img = imageRef.current
      setImageSize({
        width: img.offsetWidth,
        height: img.offsetHeight
      })
      setImageLoaded(true)
    }
  }

  // 点击设备图标
  const handleDeviceClick = (device: Device, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedDevice(device)
  }

  // 关闭设备详情
  const handleCloseDeviceDetail = () => {
    setSelectedDevice(null)
  }

  // 点击背景关闭
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      if (selectedRoom) {
        setSelectedRoom(null)
      } else if (selectedDevice) {
        setSelectedDevice(null)
      } else {
        onClose()
      }
    }
  }

  // 阻止ESC键关闭
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        if (selectedRoom) {
          setSelectedRoom(null)
        } else if (selectedDevice) {
          setSelectedDevice(null)
        } else {
          onClose()
        }
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, selectedDevice, selectedRoom, onClose])

  // 阻止背景滚动
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = ''
      return
    }
    
    const originalOverflow = document.body.style.overflow || ''
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])
  
  // 关闭时强制清理
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = ''
      if (document.body) {
        document.body.offsetHeight
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  // 使用 Portal 渲染到 body 下
  return createPortal(
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className={styles.header} style={{ flexShrink: 0 }}>
          <h2 className={styles.title}>
            {floorName} - 空调设备分布图
          </h2>
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="关闭"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 可滚动内容容器 */}
        <div className={styles.modalScrollable}>
          {/* 内容区域 */}
          <div className={styles.content} ref={containerRef} style={{ flexShrink: 0, minHeight: '400px', maxHeight: '50vh' }}>
          {/* 平面图容器 */}
          <div className={styles.imageContainer}>
            {imageSrc && (
              <img
                ref={imageRef}
                src={imageSrc}
                alt={floorName}
                className={styles.image}
                onLoad={handleImageLoad}
                style={{ opacity: imageLoaded ? 1 : 0 }}
              />
            )}
            
            {/* 设备图标层 - 只显示空调设备 */}
            {imageLoaded && sortedDevices.map((device) => {
              const iconSrc = getDeviceIcon(device.type, device.status)
              return (
                <div
                  key={device.id}
                  className={`${styles.deviceMarker} ${device.status === 'on' ? styles.deviceMarkerOn : ''} ${selectedDevice?.id === device.id ? styles.selected : ''}`}
                  style={{
                    left: `${device.position.x}%`,
                    top: `${device.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={(e) => handleDeviceClick(device, e)}
                  title={`${device.name} (${getDeviceTypeName(device.type)})`}
                >
                  <img
                    src={iconSrc}
                    alt={device.name}
                    className={styles.deviceIcon}
                  />
                  {device.status === 'on' && (
                    <span className={styles.statusIndicator}></span>
                  )}
                </div>
              )
            })}

            {/* 加载提示 */}
            {!imageLoaded && (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>加载平面图中...</p>
              </div>
            )}
          </div>

          {/* 设备列表侧边栏 */}
          <div className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>空调设备列表</h3>
            
            {/* 统计信息 */}
            <div style={{ 
              padding: '12px 16px', 
              background: 'rgba(62, 123, 250, 0.1)', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '12px',
              color: '#fff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>总数：{stats.total}</span>
                <span style={{ color: '#4CAF50' }}>开启：{stats.on}</span>
                <span style={{ color: '#9E9E9E' }}>关闭：{stats.off}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>总功率：{(stats.totalPower / 1000).toFixed(2)}kW</span>
                <span style={{ color: '#4CAF50' }}>运行功率：{(stats.onPower / 1000).toFixed(2)}kW</span>
              </div>
            </div>

            {/* 筛选和排序 */}
            <div style={{ 
              padding: '12px 16px', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'on' | 'off')}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  background: '#0f0f1e',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <option value="all">全部</option>
                <option value="on">运行中</option>
                <option value="off">已关闭</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'power' | 'room')}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  background: '#0f0f1e',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <option value="name">按名称</option>
                <option value="power">按功率</option>
                <option value="room">按房间</option>
              </select>
            </div>

            <div className={styles.deviceList}>
              {sortedDevices.length === 0 ? (
                <div className={styles.deviceListEmpty}>
                  <p>暂无空调设备</p>
                </div>
              ) : (
                sortedDevices.map((device) => {
                  return (
                  <div
                    key={device.id}
                    className={`${styles.deviceListItem} ${selectedDevice?.id === device.id ? styles.active : ''} ${device.status === 'on' ? styles.deviceListItemOn : styles.deviceListItemOff}`}
                    onClick={() => setSelectedDevice(device)}
                  >
                    <img
                      src={getDeviceIcon(device.type, device.status)}
                      alt={device.name}
                      className={styles.deviceListIcon}
                    />
                    <div className={styles.deviceListInfo}>
                      <div className={styles.deviceListName}>{device.name}</div>
                      <div className={styles.deviceListType}>
                        {getDeviceTypeName(device.type)}
                        {device.room && ` · ${device.room}`}
                        {device.power && ` · ${device.power}W`}
                      </div>
                    </div>
                    <div className={`${styles.deviceListStatus} ${device.status === 'on' ? styles.deviceListStatusOn : styles.deviceListStatusOff}`}>
                      {device.status === 'on' ? '运行中' : '已关闭'}
                    </div>
                  </div>
                  )
                })
              )}
            </div>
          </div>
          </div>

          {/* 多维度数据分析 */}
          <div style={{
            padding: '20px 24px',
            background: '#0f0f1e',
            borderTop: '2px solid rgba(62, 123, 250, 0.3)',
            flexShrink: 0
          }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#fff',
              margin: 0
            }}>
              多维度数据分析{selectedRoom ? ` - ${selectedRoom}` : ''}
            </h3>
            {selectedRoom && (
              <button
                onClick={() => setSelectedRoom(null)}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(62, 123, 250, 0.2)',
                  border: '1px solid rgba(62, 123, 250, 0.5)',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(62, 123, 250, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(62, 123, 250, 0.2)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                返回
              </button>
            )}
          </div>
          
          {!selectedRoom ? (
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}>
            {/* 区域能效概览柱状图 */}
            <div style={{
              background: '#1a1a2e',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#fff',
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                区域能效概览
              </div>
              <ReactECharts 
                option={energyEfficiencyBarOption} 
                style={{ height: '250px', width: '100%' }}
                onEvents={{
                  click: (params: any) => {
                    if (params && params.name) {
                      setSelectedRoom(params.name)
                    }
                  }
                }}
              />
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                padding: '8px 12px',
                background: averageEnergyPerSquareMeter >= 0.5
                  ? 'rgba(244, 67, 54, 0.2)'
                  : averageEnergyPerSquareMeter >= 0.3
                  ? 'rgba(255, 193, 7, 0.2)'
                  : 'rgba(76, 175, 80, 0.2)',
                borderRadius: '6px',
                border: `1px solid ${averageEnergyPerSquareMeter >= 0.5
                  ? 'rgba(244, 67, 54, 0.4)'
                  : averageEnergyPerSquareMeter >= 0.3
                  ? 'rgba(255, 193, 7, 0.4)'
                  : 'rgba(76, 175, 80, 0.4)'}`,
                backdropFilter: 'blur(4px)'
              }}>
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>平均能效</div>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: averageEnergyPerSquareMeter >= 0.5
                    ? '#F44336'
                    : averageEnergyPerSquareMeter >= 0.3
                    ? '#FFC107'
                    : '#4CAF50'
                }}>
                  {averageEnergyPerSquareMeter.toFixed(2)} 度/m²
                </div>
              </div>
            </div>

            {/* 故障监测折线图 */}
            <div style={{
              background: '#1a1a2e',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#fff',
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                故障监测
              </div>
              <ReactECharts 
                option={faultMonitoringLineOption} 
                style={{ height: '250px', width: '100%' }} 
              />
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                padding: '8px 12px',
                background: averageFaultLevel < 30
                  ? 'rgba(76, 175, 80, 0.2)'
                  : averageFaultLevel < 60
                  ? 'rgba(255, 193, 7, 0.2)'
                  : 'rgba(244, 67, 54, 0.2)',
                borderRadius: '6px',
                border: `1px solid ${averageFaultLevel < 30
                  ? 'rgba(76, 175, 80, 0.4)'
                  : averageFaultLevel < 60
                  ? 'rgba(255, 193, 7, 0.4)'
                  : 'rgba(244, 67, 54, 0.4)'}`,
                backdropFilter: 'blur(4px)'
              }}>
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>平均故障等级</div>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: averageFaultLevel < 30
                    ? '#4CAF50'
                    : averageFaultLevel < 60
                    ? '#FFC107'
                    : '#F44336'
                }}>
                  {averageFaultLevel}
                </div>
              </div>
            </div>

            {/* 能耗成本对比柱状图 */}
            <div style={{
              background: '#1a1a2e',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#fff',
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                能耗成本对比
              </div>
              <ReactECharts 
                option={energyCostBarOption} 
                style={{ height: '250px', width: '100%' }} 
              />
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                padding: '8px 12px',
                background: 'rgba(249, 100, 24, 0.2)',
                borderRadius: '6px',
                border: '1px solid rgba(249, 100, 24, 0.4)',
                backdropFilter: 'blur(4px)'
              }}>
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>平均能耗成本</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#F96418' }}>
                  {averageEnergyCost.toFixed(2)}元
                </div>
              </div>
            </div>
          </div>
          ) : selectedRoomData ? (
          // 房间详情视图
          <>
            {/* 房间信息抬头 */}
            <div style={{
              background: '#1a1a2e',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid rgba(62, 123, 250, 0.3)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '16px',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>房间名称</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>{selectedRoomData.room}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>用电量</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#3E7BFA' }}>
                    {selectedRoomData.energyConsumption.toFixed(2)} 度
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>区域开启率</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#4CAF50' }}>
                    {selectedRoomData.lightRate.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>平均运行时长</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#FFC107' }}>
                    {selectedRoomData.avgRuntime.toFixed(1)} h
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>能耗成本</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#F96418' }}>
                    {selectedRoomData.energyCost} 元
                  </div>
                </div>
              </div>
            </div>

            {/* 两个表格 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}>
              {/* 左侧表格：当天所有空调设备 */}
              <div style={{
                background: '#1a1a2e',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  当天空调设备详情
                </h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '12px'
                  }}>
                    <thead>
                      <tr style={{
                        background: 'rgba(62, 123, 250, 0.2)',
                        borderBottom: '2px solid rgba(62, 123, 250, 0.5)'
                      }}>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>序号</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>设备名称</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>额定功率(W)</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>故障监测</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>用电量(度)</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>能耗成本(元)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deviceDetailData.map((item, idx) => (
                        <tr
                          key={idx}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                          }}
                        >
                          <td style={{ padding: '10px', textAlign: 'center', color: '#fff' }}>{item.index}</td>
                          <td style={{ padding: '10px', textAlign: 'center', color: '#fff' }}>{item.deviceName}</td>
                          <td style={{ padding: '10px', textAlign: 'center', color: '#fff' }}>{item.ratedPower}</td>
                          <td style={{ padding: '10px', textAlign: 'center', color: '#fff', minWidth: '200px' }}>
                            <div style={{ 
                              display: 'inline-block',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              background: item.faultType === 'none' 
                                ? 'rgba(76, 175, 80, 0.2)' 
                                : item.faultLevel < 60
                                ? 'rgba(255, 193, 7, 0.2)'
                                : 'rgba(244, 67, 54, 0.2)',
                              border: `1px solid ${item.faultType === 'none' 
                                ? 'rgba(76, 175, 80, 0.5)' 
                                : item.faultLevel < 60
                                ? 'rgba(255, 193, 7, 0.5)'
                                : 'rgba(244, 67, 54, 0.5)'}`,
                              color: item.faultType === 'none' 
                                ? '#4CAF50' 
                                : item.faultLevel < 60
                                ? '#FFC107'
                                : '#F44336',
                              fontSize: '11px',
                              fontWeight: 600,
                              marginBottom: '8px'
                            }}>
                              {getFaultTypeName(item.faultType)}
                            </div>
                            <div style={{ marginBottom: '4px', fontSize: '10px', color: '#999' }}>
                              等级: {item.faultLevel}
                            </div>
                            {/* 故障监测折线图 */}
                            <div style={{ 
                              width: '180px', 
                              height: '60px', 
                              margin: '0 auto',
                              background: 'rgba(255, 255, 255, 0.02)',
                              borderRadius: '4px',
                              padding: '4px'
                            }}>
                              <ReactECharts
                                option={getFaultChartOption(item.faultHistory, item.faultLevel)}
                                style={{ width: '100%', height: '100%' }}
                              />
                            </div>
                          </td>
                          <td style={{ padding: '10px', textAlign: 'center', color: '#4CAF50' }}>{item.energyConsumption}</td>
                          <td style={{ padding: '10px', textAlign: 'center', color: '#F96418' }}>{item.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 右侧表格：AI计算后的优化数据 */}
              <div style={{
                background: '#1a1a2e',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid rgba(62, 123, 250, 0.3)'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  故障预警与维护建议
                </h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '12px'
                  }}>
                    <thead>
                      <tr style={{
                        background: 'rgba(62, 123, 250, 0.2)',
                        borderBottom: '2px solid rgba(62, 123, 250, 0.5)'
                      }}>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>序号</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>设备名称</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>预警等级</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>预计故障</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>维护建议</th>
                      </tr>
                    </thead>
                    <tbody>
                      {maintenanceData.map((item, idx) => (
                        <tr
                          key={idx}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                          }}
                        >
                          <td style={{ padding: '10px', textAlign: 'center', color: '#fff' }}>{item.index}</td>
                          <td style={{ padding: '10px', textAlign: 'center', color: '#fff' }}>{item.deviceName}</td>
                          <td style={{ padding: '10px', textAlign: 'center' }}>
                            <div style={{
                              display: 'inline-block',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              background: item.maintenanceLevel === 'normal'
                                ? 'rgba(76, 175, 80, 0.2)'
                                : item.maintenanceLevel === 'warning'
                                ? 'rgba(255, 193, 7, 0.2)'
                                : 'rgba(244, 67, 54, 0.2)',
                              border: `1px solid ${item.maintenanceLevel === 'normal'
                                ? 'rgba(76, 175, 80, 0.5)'
                                : item.maintenanceLevel === 'warning'
                                ? 'rgba(255, 193, 7, 0.5)'
                                : 'rgba(244, 67, 54, 0.5)'}`,
                              color: item.maintenanceLevel === 'normal'
                                ? '#4CAF50'
                                : item.maintenanceLevel === 'warning'
                                ? '#FFC107'
                                : '#F44336',
                              fontSize: '11px',
                              fontWeight: 600
                            }}>
                              {item.maintenanceLevel === 'normal' ? '正常' : item.maintenanceLevel === 'warning' ? '警告' : '紧急'}
                            </div>
                          </td>
                          <td style={{ padding: '10px', textAlign: 'left', color: '#FFC107', fontSize: '11px' }}>{item.predictedFault}</td>
                          <td style={{ padding: '10px', textAlign: 'left', color: '#fff', fontSize: '11px' }}>{item.maintenanceSuggestion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
          ) : null}
          </div>
        </div>

        {/* 设备详情弹窗 */}
        {selectedDevice && (
          <div className={styles.detailOverlay} onClick={handleCloseDeviceDetail}>
            <div className={styles.detailModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.detailHeader}>
                <h3>{selectedDevice.name}</h3>
                <button
                  className={styles.detailClose}
                  onClick={handleCloseDeviceDetail}
                  aria-label="关闭"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className={styles.detailContent}>
                <div className={styles.detailIcon}>
                  <img
                    src={getDeviceIcon(selectedDevice.type, selectedDevice.status)}
                    alt={selectedDevice.name}
                  />
                </div>
                <div className={styles.detailInfo}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>设备类型：</span>
                    <span className={styles.detailValue}>{getDeviceTypeName(selectedDevice.type)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>运行状态：</span>
                    <span className={`${styles.detailValue} ${selectedDevice.status === 'on' ? styles.statusOn : styles.statusOff}`}>
                      {selectedDevice.status === 'on' ? '运行中' : '已关闭'}
                    </span>
                  </div>
                  {selectedDevice.room && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>所属房间：</span>
                      <span className={styles.detailValue}>{selectedDevice.room}</span>
                    </div>
                  )}
                  {selectedDevice.power !== undefined && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>功率：</span>
                      <span className={styles.detailValue}>{selectedDevice.power}W</span>
                    </div>
                  )}
                  {selectedDevice.temperature !== undefined && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>温度：</span>
                      <span className={styles.detailValue}>{selectedDevice.temperature}°C</span>
                    </div>
                  )}
                  {selectedDevice.description && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>描述：</span>
                      <span className={styles.detailValue}>{selectedDevice.description}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default ACFloorPlan
