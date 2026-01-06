import React, { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import ReactECharts from 'echarts-for-react'
import styles from './FloorPlan.module.css'
import { Device, DeviceType, DeviceStatus } from './FloorPlan'

interface LightFloorPlanProps {
  isOpen: boolean
  onClose: () => void
  floorName?: string // 楼层名称
  floorPlanImage?: string // 平面图图片路径，如果不提供则使用默认占位图
  devices?: Device[] // 设备列表（只显示照明设备）
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
  return iconMap[type]?.[status] || iconMap.light.off
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

const LightFloorPlan: React.FC<LightFloorPlanProps> = ({
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
  const [showGroupControl, setShowGroupControl] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [devicesState, setDevicesState] = useState<Map<string, DeviceStatus>>(new Map())
  const initializedRef = useRef(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // 存储每个设备的固定随机数据，避免每次渲染都重新生成
  const deviceRuntimeDataRef = useRef<Map<string, { runtimeHours: number; timeSlots: Array<{ start: string; end: string; hours: number }> }>>(new Map())
  // 存储每个设备的AI优化数据，避免每次渲染都重新生成
  const aiOptimizedDataRef = useRef<Map<string, { 
    aiRuntimeHours: number
    aiTimeSlots: Array<{ start: string; end: string; hours: number }>
    reductionRate: number
    optimizationLogic: string
  }>>(new Map())

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

  // 只显示照明设备，并使用最新状态
  const allLightDevices = devices
    .filter(device => device.type === 'light')
    .map(device => ({
      ...device,
      status: devicesState.get(device.id) || device.status
    }))
  
  // 按状态筛选
  const filteredDevices = filterStatus === 'all' 
    ? allLightDevices 
    : allLightDevices.filter(device => device.status === filterStatus)
  
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

  // 获取设备组列表（支持跨房间组合）
  const getDeviceGroups = () => {
    const groups: Array<{ id: string; name: string; deviceIds: string[] }> = []
    
    // 按房间分组（每个房间作为一个组）
    const roomsMap = new Map<string, string[]>()
    allLightDevices.forEach(device => {
      const room = device.room || '未分组'
      if (!roomsMap.has(room)) {
        roomsMap.set(room, [])
      }
      roomsMap.get(room)!.push(device.id)
    })
    
    // 添加每个房间作为独立组
    roomsMap.forEach((deviceIds, room) => {
      groups.push({
        id: `room-${room}`,
        name: `${room} (${deviceIds.length}个设备)`,
        deviceIds
      })
    })
    
    // 添加跨房间组合（示例：可以组合多个房间）
    // 例如：组合前3个房间的所有设备
    const roomArray = Array.from(roomsMap.entries())
    if (roomArray.length >= 2) {
      // 组合前两个房间
      const combinedDeviceIds: string[] = []
      roomArray.slice(0, 2).forEach(([room, deviceIds]) => {
        combinedDeviceIds.push(...deviceIds)
      })
      if (combinedDeviceIds.length > 0) {
        groups.push({
          id: 'combined-rooms-1-2',
          name: `${roomArray[0][0]} + ${roomArray[1][0]} (${combinedDeviceIds.length}个设备)`,
          deviceIds: combinedDeviceIds
        })
      }
    }
    
    // 如果房间数量>=3，添加前3个房间的组合
    if (roomArray.length >= 3) {
      const combinedDeviceIds: string[] = []
      roomArray.slice(0, 3).forEach(([room, deviceIds]) => {
        combinedDeviceIds.push(...deviceIds)
      })
      if (combinedDeviceIds.length > 0) {
        groups.push({
          id: 'combined-rooms-1-3',
          name: `${roomArray[0][0]} + ${roomArray[1][0]} + ${roomArray[2][0]} (${combinedDeviceIds.length}个设备)`,
          deviceIds: combinedDeviceIds
        })
      }
    }
    
    return groups
  }

  const deviceGroups = getDeviceGroups()
  
  // 获取当前选中组的设备ID集合
  const selectedGroupDeviceIds = selectedGroup 
    ? new Set(deviceGroups.find(g => g.id === selectedGroup)?.deviceIds || [])
    : new Set<string>()

  // 群控功能：根据选中的组控制设备
  const handleGroupControl = async (action: 'on' | 'off') => {
    if (!selectedGroup) {
      alert('请先选择一个设备组')
      return
    }

    const group = deviceGroups.find(g => g.id === selectedGroup)
    if (!group || group.deviceIds.length === 0) {
      alert('该组没有设备')
      return
    }

    const targetDevices = allLightDevices.filter(d => group.deviceIds.includes(d.id))
    const newStatus: DeviceStatus = action === 'off' ? 'off' : 'on'
    
    // 更新设备状态
    const newStateMap = new Map(devicesState)
    targetDevices.forEach(device => {
      newStateMap.set(device.id, newStatus)
    })
    setDevicesState(newStateMap)

    // 这里应该调用API实际控制设备
    // await controlDevices(targetDevices.map(d => d.id), newStatus)
  }

  // 统计信息（使用最新状态）
  const stats = {
    total: allLightDevices.length,
    on: allLightDevices.filter(d => {
      const currentStatus = devicesState.get(d.id) || d.status
      return currentStatus === 'on'
    }).length,
    off: allLightDevices.filter(d => {
      const currentStatus = devicesState.get(d.id) || d.status
      return currentStatus === 'off'
    }).length,
    totalPower: allLightDevices.reduce((sum, d) => sum + (d.power || 0), 0),
    onPower: allLightDevices.filter(d => {
      const currentStatus = devicesState.get(d.id) || d.status
      return currentStatus === 'on'
    }).reduce((sum, d) => sum + (d.power || 0), 0)
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

    allLightDevices.forEach(device => {
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

    return Array.from(roomMap.entries()).map(([room, info]) => ({
      room,
      lightRate: info.total > 0 ? (info.on / info.total * 100) : 0, // 亮灯率（%）
      avgRuntime: info.on > 0 ? (info.on / info.total * 8) : 0, // 平均运行时长（小时，模拟数据）
      energyCost: (info.onPower / 1000 * 0.6).toFixed(2), // 能耗成本（元，假设0.6元/度）
      totalDevices: info.total,
      onDevices: info.on
    }))
  }, [allLightDevices, devicesState])

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

  // 获取选中房间的所有照明设备
  const selectedRoomDevices = useMemo(() => {
    if (!selectedRoom) return []
    return allLightDevices.filter(device => device.room === selectedRoom)
  }, [selectedRoom, allLightDevices])

  // 生成时段数据（3个时段）
  const generateTimeSlots = (totalHours: number): Array<{ start: string; end: string; hours: number }> => {
    if (totalHours === 0) {
      return [
        { start: '-', end: '-', hours: 0 },
        { start: '-', end: '-', hours: 0 },
        { start: '-', end: '-', hours: 0 }
      ]
    }
    
    // 常见的时段：上午、下午、晚上
    const slots = [
      { start: '08:00', end: '12:00', hours: 0 },
      { start: '14:00', end: '18:00', hours: 0 },
      { start: '19:00', end: '22:00', hours: 0 }
    ]
    
    // 随机分配总时长到3个时段，确保总和等于totalHours
    let remaining = totalHours
    const maxSlotHours = [4, 4, 3] // 每个时段的最大小时数
    
    for (let i = 0; i < slots.length - 1; i++) {
      const maxHours = Math.min(remaining, maxSlotHours[i])
      const minHours = Math.max(0, remaining - maxSlotHours.slice(i + 1).reduce((sum, max) => sum + max, 0))
      const hours = minHours + Math.random() * (maxHours - minHours)
      slots[i].hours = Math.max(0, Math.min(hours, remaining))
      remaining = Math.max(0, remaining - slots[i].hours)
    }
    slots[slots.length - 1].hours = Math.max(0, remaining) // 最后一个时段分配剩余时间
    
    // 确保总和正确（处理浮点数精度问题）
    const sum = slots.reduce((acc, slot) => acc + slot.hours, 0)
    if (Math.abs(sum - totalHours) > 0.01) {
      const diff = totalHours - sum
      slots[slots.length - 1].hours += diff
    }
    
    return slots
  }

  // 计算设备详情数据（当天数据）
  const deviceDetailData = useMemo(() => {
    return selectedRoomDevices.map((device, index) => {
      const currentStatus = devicesState.get(device.id) || device.status
      const power = device.power || 0
      
      // 如果设备未开启，使用0
      if (currentStatus === 'off') {
        return {
          index: index + 1,
          deviceName: device.name,
          ratedPower: power,
          runtimeHours: '0.0',
          timeSlots: [
            { start: '-', end: '-', hours: 0 },
            { start: '-', end: '-', hours: 0 },
            { start: '-', end: '-', hours: 0 }
          ],
          energyConsumption: '0.00',
          cost: '0.00'
        }
      }
      
      // 如果设备开启，使用固定的随机数据（首次生成后保持不变）
      if (!deviceRuntimeDataRef.current.has(device.id)) {
        const runtimeHours = Math.random() * 7 + 1
        const timeSlots = generateTimeSlots(runtimeHours)
        deviceRuntimeDataRef.current.set(device.id, { runtimeHours, timeSlots })
      }
      
      const { runtimeHours, timeSlots } = deviceRuntimeDataRef.current.get(device.id)!
      
      // 用电量 = 功率(W) * 时长(h) / 1000 (转换为度)
      const energyConsumption = (power * runtimeHours / 1000).toFixed(2)
      // 能耗成本 = 用电量 * 0.6元/度
      const cost = (parseFloat(energyConsumption) * 0.6).toFixed(2)
      
      return {
        index: index + 1,
        deviceName: device.name,
        ratedPower: power,
        runtimeHours: runtimeHours.toFixed(1),
        timeSlots, // 3个时段数据
        energyConsumption,
        cost
      }
    })
  }, [selectedRoomDevices, devicesState])

  // AI计算后的优化数据
  const aiOptimizedData = useMemo(() => {
    return selectedRoomDevices.map((device, index) => {
      const power = device.power || 0
      const currentData = deviceDetailData[index]
      const currentRuntime = parseFloat(currentData.runtimeHours)
      
      // 如果设备未开启，AI建议保持关闭
      if (currentRuntime === 0) {
        return {
          index: index + 1,
          deviceName: device.name,
          aiRuntimeHours: '0.0',
          aiTimeSlots: [
            { start: '-', end: '-', hours: 0 },
            { start: '-', end: '-', hours: 0 },
            { start: '-', end: '-', hours: 0 }
          ],
          predictedEnergyConsumption: '0.00',
          optimizationLogic: '设备已关闭，无需优化'
        }
      }
      
      // 如果还没有生成AI优化数据，则生成并存储
      if (!aiOptimizedDataRef.current.has(device.id)) {
        // AI优化逻辑：根据设备类型和使用场景优化开启时长
        // 模拟AI计算：通常可以减少20-40%的开启时长
        const reductionRate = 0.2 + Math.random() * 0.2 // 20%-40%的减少
        const aiRuntimeHours = currentRuntime * (1 - reductionRate)
        
        // 生成AI优化后的时段（基于原始时段进行优化）
        const aiTimeSlots = currentData.timeSlots.map(slot => {
          if (slot.start === '-') {
            return { start: '-', end: '-', hours: 0 }
          }
          // 对每个时段应用相同的减少率，但可以有一些随机调整
          const slotReduction = reductionRate + (Math.random() - 0.5) * 0.1 // 在减少率基础上±5%
          const optimizedHours = Math.max(0, slot.hours * (1 - slotReduction))
          return {
            start: slot.start,
            end: slot.end,
            hours: optimizedHours
          }
        })
        
        // 优化逻辑说明
        const optimizationLogic = 
          aiRuntimeHours < currentRuntime * 0.7
            ? '智能调光：根据自然光照自动调节亮度，减少30%能耗'
            : aiRuntimeHours < currentRuntime * 0.85
            ? '时段优化：非必要时段自动关闭，节省20%能耗'
            : '使用习惯优化：根据人员流动优化开关时间，节省15%能耗'
        
        aiOptimizedDataRef.current.set(device.id, {
          aiRuntimeHours,
          aiTimeSlots,
          reductionRate,
          optimizationLogic
        })
      }
      
      const aiData = aiOptimizedDataRef.current.get(device.id)!
      const aiEnergyConsumption = (power * aiData.aiRuntimeHours / 1000).toFixed(2)
      
      return {
        index: index + 1,
        deviceName: device.name,
        aiRuntimeHours: aiData.aiRuntimeHours.toFixed(1),
        aiTimeSlots: aiData.aiTimeSlots,
        predictedEnergyConsumption: aiEnergyConsumption,
        optimizationLogic: aiData.optimizationLogic
      }
    })
  }, [selectedRoomDevices, deviceDetailData])

  // 计算所有房间的平均亮灯率
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

  // 区域亮灯率饼图配置
  const lightRatePieOption = useMemo(() => {
    const data = roomData.map(room => ({
      value: room.lightRate,
      name: room.room
    }))

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}% ({d}%)'
      },
      legend: {
        bottom: '5%',
        left: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 12
        }
      },
      series: [
        {
          name: '亮灯率',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#1a1a2e',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}\n{c}%',
            color: '#fff',
            fontSize: 11
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 13,
              fontWeight: 'bold'
            }
          },
          data: data.map((item, index) => ({
            ...item,
            itemStyle: {
              color: ['#3E7BFA', '#4CAF50', '#F96418', '#FFC107', '#9C27B0', '#00BCD4'][index % 6]
            }
          }))
        }
      ]
    }
  }, [roomData])

  // 计算所有开启设备的平均运行时长（关闭不计算）
  const averageRuntime = useMemo(() => {
    const onDevices = allLightDevices.filter(device => {
      const currentStatus = devicesState.get(device.id) || device.status
      return currentStatus === 'on'
    })
    
    if (onDevices.length === 0) return 0
    
    // 确保所有开启设备的数据都已生成
    onDevices.forEach(device => {
      if (!deviceRuntimeDataRef.current.has(device.id)) {
        const runtimeHours = Math.random() * 7 + 1
        const timeSlots = generateTimeSlots(runtimeHours)
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
  }, [allLightDevices, devicesState])

  // 平均运行时长柱状图配置
  const avgRuntimeBarOption = useMemo(() => {
    const sortedRooms = [...roomData].sort((a, b) => b.avgRuntime - a.avgRuntime)
    
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: '{b}: {c}小时'
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
        name: '小时',
        nameTextStyle: {
          color: '#999'
        },
        axisLine: {
          lineStyle: {
            color: '#3E7BFA'
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
            color: '#3E7BFA'
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
          data: sortedRooms.map(r => parseFloat(r.avgRuntime.toFixed(1))),
          itemStyle: {
            color: '#3E7BFA'
          },
          label: {
            show: true,
            position: 'right',
            color: '#fff',
            formatter: '{c}小时'
          }
        }
      ]
    }
  }, [roomData])

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
      onClose()
    }
  }

  // 阻止ESC键关闭
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        if (selectedDevice) {
          setSelectedDevice(null)
        } else {
          onClose()
        }
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, selectedDevice, onClose])

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
            {floorName} - 照明设备分布图
          </h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setShowGroupControl(!showGroupControl)}
              style={{
                padding: '8px 16px',
                background: showGroupControl ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              {showGroupControl ? '隐藏群控' : '群控策略'}
            </button>
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
        </div>

        {/* 群控策略面板 */}
        {showGroupControl && (
          <div style={{
            padding: '16px 24px',
            background: 'rgba(15, 15, 30, 0.95)',
            borderBottom: '2px solid rgba(62, 123, 250, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexShrink: 0
          }}>
            <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500, minWidth: '80px' }}>
              设备组：
            </div>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: '#0f0f1e',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
                maxWidth: '300px'
              }}
            >
              <option value="">请选择设备组</option>
              {deviceGroups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleGroupControl('on')}
              disabled={!selectedGroup}
              style={{
                padding: '8px 20px',
                background: !selectedGroup ? '#555' : '#4CAF50',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: !selectedGroup ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                opacity: !selectedGroup ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              开启
            </button>
            <button
              onClick={() => handleGroupControl('off')}
              disabled={!selectedGroup}
              style={{
                padding: '8px 20px',
                background: !selectedGroup ? '#555' : '#9E9E9E',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: !selectedGroup ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                opacity: !selectedGroup ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              关闭
            </button>
          </div>
        )}

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
            
            {/* 设备图标层 - 只显示照明设备 */}
            {imageLoaded && sortedDevices.map((device) => {
              const iconSrc = getDeviceIcon(device.type, device.status)
              const isInSelectedGroup = selectedGroupDeviceIds.has(device.id)
              return (
                <div
                  key={device.id}
                  className={`${styles.deviceMarker} ${device.status === 'on' ? styles.deviceMarkerOn : ''} ${selectedDevice?.id === device.id ? styles.selected : ''} ${isInSelectedGroup ? styles.groupSelected : ''}`}
                  style={{
                    left: `${device.position.x}%`,
                    top: `${device.position.y}%`,
                    transform: 'translate(-50%, -50%)',
                    ...(isInSelectedGroup && {
                      boxShadow: '0 0 20px rgba(62, 123, 250, 0.8), 0 0 40px rgba(62, 123, 250, 0.4)',
                      border: '3px solid #3E7BFA',
                      borderRadius: '50%',
                      padding: '4px',
                      background: 'rgba(62, 123, 250, 0.2)'
                    })
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
            <h3 className={styles.sidebarTitle}>照明设备列表</h3>
            
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
                  <p>暂无照明设备</p>
                </div>
              ) : (
                sortedDevices.map((device) => {
                  const isInSelectedGroup = selectedGroupDeviceIds.has(device.id)
                  return (
                  <div
                    key={device.id}
                    className={`${styles.deviceListItem} ${selectedDevice?.id === device.id ? styles.active : ''} ${device.status === 'on' ? styles.deviceListItemOn : styles.deviceListItemOff}`}
                    onClick={() => setSelectedDevice(device)}
                    style={{
                      cursor: 'pointer',
                      ...(isInSelectedGroup && {
                        border: '2px solid #3E7BFA',
                        background: 'rgba(62, 123, 250, 0.15)',
                        boxShadow: '0 0 10px rgba(62, 123, 250, 0.3)'
                      })
                    }}
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
            {/* 区域亮灯率饼图 */}
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
                区域亮灯率
              </div>
              <ReactECharts 
                option={lightRatePieOption} 
                style={{ height: '250px', width: '100%' }} 
                onEvents={{
                  click: handlePieChartClick
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
                background: 'rgba(62, 123, 250, 0.2)',
                borderRadius: '6px',
                border: '1px solid rgba(62, 123, 250, 0.4)',
                backdropFilter: 'blur(4px)'
              }}>
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>平均亮灯率</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#3E7BFA' }}>
                  {averageLightRate.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* 平均运行时长柱状图 */}
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
                平均运行时长
              </div>
              <ReactECharts 
                option={avgRuntimeBarOption} 
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
                background: 'rgba(62, 123, 250, 0.2)',
                borderRadius: '6px',
                border: '1px solid rgba(62, 123, 250, 0.4)',
                backdropFilter: 'blur(4px)'
              }}>
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>平均运行时长</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#3E7BFA' }}>
                  {averageRuntime.toFixed(1)}h
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
                    {(selectedRoomData.onPower / 1000).toFixed(2)} 度
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>区域亮灯率</div>
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
              {/* 左侧表格：当天所有照明设备 */}
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
                  当天照明设备详情
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
                        <th style={{ padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>开启时长</th>
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
                          <td style={{ padding: '10px', textAlign: 'left', color: '#fff', fontSize: '11px', lineHeight: '1.6' }}>
                            {item.timeSlots.map((slot, slotIdx) => (
                              <div key={slotIdx} style={{ marginBottom: '2px' }}>
                                {slot.start !== '-' ? (
                                  <span>{slot.start}-{slot.end}: <span style={{ color: '#4CAF50' }}>{slot.hours.toFixed(1)}h</span></span>
                                ) : (
                                  <span style={{ color: '#666' }}>-</span>
                                )}
                              </div>
                            ))}
                            <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontWeight: 600, color: '#FFC107' }}>
                              总计: {item.runtimeHours}h
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
                  AI优化建议
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
                        <th style={{ padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>AI开启时长</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>预计用电量(度)</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 600 }}>优化逻辑</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiOptimizedData.map((item, idx) => (
                        <tr
                          key={idx}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                          }}
                        >
                          <td style={{ padding: '10px', textAlign: 'center', color: '#fff' }}>{item.index}</td>
                          <td style={{ padding: '10px', textAlign: 'center', color: '#fff' }}>{item.deviceName}</td>
                          <td style={{ padding: '10px', textAlign: 'left', color: '#fff', fontSize: '11px', lineHeight: '1.6' }}>
                            {item.aiTimeSlots ? (
                              <>
                                {item.aiTimeSlots.map((slot, slotIdx) => (
                                  <div key={slotIdx} style={{ marginBottom: '2px' }}>
                                    {slot.start !== '-' ? (
                                      <span>{slot.start}-{slot.end}: <span style={{ color: '#4CAF50' }}>{slot.hours.toFixed(1)}h</span></span>
                                    ) : (
                                      <span style={{ color: '#666' }}>-</span>
                                    )}
                                  </div>
                                ))}
                                <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontWeight: 600, color: '#4CAF50' }}>
                                  总计: {item.aiRuntimeHours}h
                                </div>
                              </>
                            ) : (
                              <span style={{ color: '#4CAF50' }}>{item.aiRuntimeHours}h</span>
                            )}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'center', color: '#4CAF50' }}>{item.predictedEnergyConsumption}</td>
                          <td style={{ padding: '10px', textAlign: 'left', color: '#FFC107', fontSize: '11px' }}>{item.optimizationLogic}</td>
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
      </div>
    </div>,
    document.body
  )
}

export default LightFloorPlan

