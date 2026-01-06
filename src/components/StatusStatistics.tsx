import React, { useState, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import StatisticsAIAnalysis from './StatisticsAIAnalysis'
import './StatusStatistics.css'

interface StatusStatisticsProps {
  floor?: string // 楼层参数，可选
  roomCount?: number // 房间数量，用于楼层统计
  rooms?: Array<{ name: string }> // 房间列表，用于楼层统计
  room?: string // 房间名称，用于房间统计
}

type SortField = 'name' | 'door' | 'occupied' | 'ac' | 'light' | 'energy' | 'power' | null
type SortOrder = 'asc' | 'desc'

const StatusStatistics: React.FC<StatusStatisticsProps> = ({ floor, roomCount, rooms, room }) => {
  const [timeRange, setTimeRange] = useState('近7天')
  const [aiAnalysisExpanded, setAiAnalysisExpanded] = useState(true) // 默认展开
  const [sortField, setSortField] = useState<SortField>('power') // 默认按功率排序
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc') // 默认降序

  const timeRanges = ['当天', '近7天', '近15天', '近30天']
  
  // 是否为楼层统计模式（有楼层且有多个房间，且没有指定具体房间）
  const isFloorMode = floor && roomCount && roomCount > 1 && !room

  // 生成时间线图表数据
  const generateTimelineData = () => {
    const dates = []
    const now = new Date()
    
    if (timeRange === '当天') {
      dates.push(now.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }))
    } else {
      const days = timeRange === '近7天' ? 7 : timeRange === '近15天' ? 15 : 30
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }))
      }
    }

    return dates
  }

  const dates = useMemo(() => generateTimelineData(), [timeRange])

  // 生成单个时间段数据 [开始时间, 结束时间]
  const generateSingleTimeRange = () => {
    const startHour = Math.random() * 14 + 6 // 6-20点开始
    const duration = Math.random() * 8 + 2 // 2-10小时
    const endHour = Math.min(startHour + duration, 24)
    return [startHour, endHour]
  }

  // 生成多个分段时间段（用于门开启等状态）
  const generateMultipleTimeRanges = (minSegments: number = 2, maxSegments: number = 5) => {
    const numSegments = Math.floor(Math.random() * (maxSegments - minSegments + 1)) + minSegments
    const segments: number[][] = []
    
    // 将一天分成几个时间段，然后在每个时间段内随机生成一个开启区间
    const dayStart = 6 // 6点开始
    const dayEnd = 22 // 22点结束
    const dayDuration = dayEnd - dayStart
    const segmentDuration = dayDuration / numSegments
    
    for (let i = 0; i < numSegments; i++) {
      // 每个时间段的基础范围
      const baseStart = dayStart + i * segmentDuration
      const baseEnd = baseStart + segmentDuration
      
      // 在基础范围内随机生成一个开启时间段
      const rangeStart = baseStart + Math.random() * (segmentDuration * 0.6) // 在基础范围的60%内随机开始
      const duration = Math.random() * 2 + 0.5 // 0.5-2.5小时
      const rangeEnd = Math.min(rangeStart + duration, baseEnd, 24)
      
      if (rangeEnd > rangeStart) {
        segments.push([rangeStart, rangeEnd])
      }
    }
    
    // 按开始时间排序
    segments.sort((a, b) => a[0] - b[0])
    
    // 确保至少有一个时间段
    return segments.length > 0 ? segments : [[8, 10], [14, 16], [18, 20]] // 默认返回3个时间段
  }

  // 为每个日期生成四个状态的时间段数据
  // 如果是楼层统计，需要汇总多个房间的数据
  const generateTimeRangeData = () => {
    const roomNum = roomCount || 1 // 默认1个房间（单个房间统计）
    
    return dates.map(() => {
      // 对于楼层统计，需要汇总多个房间的数据
      // 门开启：每个房间可能有多个时间段，汇总后时间段会更多
      let doorRanges: number[][] = []
      for (let i = 0; i < roomNum; i++) {
        const roomDoorRanges = generateMultipleTimeRanges(2, 5)
        doorRanges = doorRanges.concat(roomDoorRanges)
      }
      
      // 有人、空调、照明：汇总所有房间的时间段
      let occupiedRanges: number[][] = []
      let acRanges: number[][] = []
      let lightRanges: number[][] = []
      
      for (let i = 0; i < roomNum; i++) {
        occupiedRanges.push(generateSingleTimeRange())
        acRanges.push(generateSingleTimeRange())
        lightRanges.push(generateSingleTimeRange())
      }
      
      // 合并重叠的时间段
      const mergeTimeRanges = (ranges: number[][]): number[][] => {
        if (ranges.length === 0) return []
        const sorted = [...ranges].sort((a, b) => a[0] - b[0])
        const merged: number[][] = []
        let current = [...sorted[0]]
        
        for (let i = 1; i < sorted.length; i++) {
          const [start, end] = sorted[i]
          if (start <= current[1]) {
            current[1] = Math.max(current[1], end)
          } else {
            merged.push([...current])
            current = [start, end]
          }
        }
        merged.push(current)
        return merged
      }
      
      // 对于楼层统计，返回合并后的时间段
      if (roomNum > 1) {
        return {
          door: mergeTimeRanges(doorRanges),
          occupied: mergeTimeRanges(occupiedRanges),
          ac: mergeTimeRanges(acRanges),
          light: mergeTimeRanges(lightRanges)
        }
      } else {
        // 单个房间，保持原有逻辑
        return {
          door: generateMultipleTimeRanges(2, 5),
          occupied: generateSingleTimeRange(),
          ac: generateSingleTimeRange(),
          light: generateSingleTimeRange()
        }
      }
    })
  }

  // 使用useMemo来生成并缓存时间范围数据，只在依赖项变化时重新生成
  const timeRangeData = useMemo(() => {
    return generateTimeRangeData()
  }, [dates.length, roomCount, timeRange])

  // 将时间段数据展开为多个数据项（支持单个或多个时间段）
  const expandTimeRangeData = (ranges: number[] | number[][], dateIndex: number): any[] => {
    if (Array.isArray(ranges[0])) {
      // 多个时间段，每个时间段作为一个数据项
      return (ranges as number[][]).map((range: number[]) => [dateIndex, range])
    } else {
      // 单个时间段
      return [[dateIndex, ranges as number[]]]
    }
  }

  // 展开所有状态的数据
  const expandAllData = () => {
    const doorData: any[] = []
    const occupiedData: any[] = []
    const acData: any[] = []
    const lightData: any[] = []

    timeRangeData.forEach((item, dateIndex) => {
      doorData.push(...expandTimeRangeData(item.door, dateIndex))
      occupiedData.push(...expandTimeRangeData(item.occupied, dateIndex))
      acData.push(...expandTimeRangeData(item.ac, dateIndex))
      lightData.push(...expandTimeRangeData(item.light, dateIndex))
    })

    return { doorData, occupiedData, acData, lightData }
  }

  const { doorData, occupiedData, acData, lightData } = expandAllData()

  // 计算各状态的总时长（小时）
  const calculateTotalHours = () => {
    let doorHours = 0
    let occupiedHours = 0
    let acHours = 0
    let lightHours = 0

    // 计算单个时间段或时间段数组的总时长
    const calculateRangeHours = (ranges: number[] | number[][]): number => {
      if (Array.isArray(ranges[0])) {
        // 多个时间段
        return (ranges as number[][]).reduce((sum, [start, end]) => sum + (end - start), 0)
      } else {
        // 单个时间段
        const [start, end] = ranges as number[]
        return end - start
      }
    }

    timeRangeData.forEach((item) => {
      doorHours += calculateRangeHours(item.door)
      occupiedHours += calculateRangeHours(item.occupied)
      acHours += calculateRangeHours(item.ac)
      lightHours += calculateRangeHours(item.light)
    })

    return {
      door: Math.round(doorHours * 10) / 10,
      occupied: Math.round(occupiedHours * 10) / 10,
      ac: Math.round(acHours * 10) / 10,
      light: Math.round(lightHours * 10) / 10
    }
  }

  const totalHours = calculateTotalHours()
  
  // 生成每个房间的总时长数据（楼层统计模式）
  const generateRoomStatistics = () => {
    if (!isFloorMode || !roomCount) return []
    
    const roomStats = []
    for (let i = 0; i < roomCount; i++) {
      // 为每个房间生成总时长数据
      const doorHours = Math.round((Math.random() * 8 + 2) * 10) / 10 // 2-10小时
      const occupiedHours = Math.round((Math.random() * 6 + 1) * 10) / 10 // 1-7小时
      const acHours = Math.round((Math.random() * 8 + 2) * 10) / 10 // 2-10小时
      const lightHours = Math.round((Math.random() * 8 + 2) * 10) / 10 // 2-10小时
      const energy = Math.round((Math.random() * 37 + 3) * 10) / 10 // 3-40度
      const power = Math.round((Math.random() * 21 + 30) * 10) / 10 // 30-50W
      
      roomStats.push({
        name: rooms && rooms[i] ? rooms[i].name : `房间${i + 1}`,
        door: doorHours,
        occupied: occupiedHours,
        ac: acHours,
        light: lightHours,
        energy: energy,
        power: power
      })
    }
    return roomStats
  }

  // 使用useMemo来生成并缓存房间统计数据，只在依赖项变化时重新生成
  const roomStatistics = useMemo(() => {
    if (!isFloorMode) {
      return []
    }
    return generateRoomStatistics()
  }, [isFloorMode, roomCount, rooms])

  // 处理排序
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  // 对房间统计数据进行排序
  const sortedRoomStatistics = isFloorMode ? [...roomStatistics].sort((a, b) => {
    if (!sortField) return 0
    
    let comparison = 0
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name, 'zh-CN')
    } else if (sortField === 'door') {
      comparison = a.door - b.door
    } else if (sortField === 'occupied') {
      comparison = a.occupied - b.occupied
    } else if (sortField === 'ac') {
      comparison = a.ac - b.ac
    } else if (sortField === 'light') {
      comparison = a.light - b.light
    } else if (sortField === 'energy') {
      comparison = (a.energy || 0) - (b.energy || 0)
    } else if (sortField === 'power') {
      comparison = (a.power || 0) - (b.power || 0)
    }
    return sortOrder === 'asc' ? comparison : -comparison
  }) : []
  
  // 如果是楼层模式，基于房间统计数据计算总时长
  const floorTotalHours = isFloorMode ? roomStatistics.reduce((acc, room) => ({
    door: acc.door + room.door,
    occupied: acc.occupied + room.occupied,
    ac: acc.ac + room.ac,
    light: acc.light + room.light
  }), { door: 0, occupied: 0, ac: 0, light: 0 }) : null
  
  // 使用楼层统计数据或原有统计数据
  const displayTotalHours = isFloorMode && floorTotalHours ? {
    door: Math.round(floorTotalHours.door * 10) / 10,
    occupied: Math.round(floorTotalHours.occupied * 10) / 10,
    ac: Math.round(floorTotalHours.ac * 10) / 10,
    light: Math.round(floorTotalHours.light * 10) / 10
  } : totalHours
  
  // 计算实际工作时长（所有状态时间段的并集）
  const calculateWorkingHours = () => {
    // 收集所有时间段
    const allTimeRanges: number[][] = []
    
    timeRangeData.forEach((item) => {
      // 门开启：多个时间段
      if (Array.isArray(item.door) && Array.isArray(item.door[0])) {
        item.door.forEach((range: number[]) => {
          allTimeRanges.push([...range])
        })
      } else {
        allTimeRanges.push([...(item.door as number[])])
      }
      
      // 其他状态：单个时间段
      allTimeRanges.push([...item.occupied])
      allTimeRanges.push([...item.ac])
      allTimeRanges.push([...item.light])
    })
    
    // 合并重叠的时间段
    if (allTimeRanges.length === 0) return 0
    
    // 按开始时间排序
    allTimeRanges.sort((a, b) => a[0] - b[0])
    
    // 合并重叠区间
    const merged: number[][] = []
    let current = [...allTimeRanges[0]]
    
    for (let i = 1; i < allTimeRanges.length; i++) {
      const [start, end] = allTimeRanges[i]
      
      // 如果当前区间与下一个区间重叠或相邻，则合并
      if (start <= current[1]) {
        current[1] = Math.max(current[1], end)
      } else {
        merged.push([...current])
        current = [start, end]
      }
    }
    merged.push(current)
    
    // 计算总时长
    let total = 0
    merged.forEach(([start, end]) => {
      total += end - start
    })
    
    return Math.round(total * 10) / 10
  }
  
  const workingHours = !isFloorMode ? calculateWorkingHours() : 0
  
  // 计算总时间范围（天数 × 24小时）- 仅用于非楼层模式
  const totalTimeRange = !isFloorMode ? dates.length * 24 : 0
  
  // 计算所有状态的总时长（用于饼图占比计算）
  const totalAllHours = displayTotalHours.door + displayTotalHours.occupied + displayTotalHours.ac + displayTotalHours.light
  
  // 计算各状态占总时间范围的比例（因为状态可以叠加，所以各状态独立计算）
  const doorPercent = totalTimeRange > 0 ? (displayTotalHours.door / totalTimeRange * 100) : 0
  const occupiedPercent = totalTimeRange > 0 ? (displayTotalHours.occupied / totalTimeRange * 100) : 0
  const acPercent = totalTimeRange > 0 ? (displayTotalHours.ac / totalTimeRange * 100) : 0
  const lightPercent = totalTimeRange > 0 ? (displayTotalHours.light / totalTimeRange * 100) : 0

  // 饼图配置 - 展示各状态的相对占比（状态可叠加）
  const pieChartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const hours = params.value
        const relativePercent = params.percent // 相对于所有状态总时长的占比（用于饼图显示）
        const workingPercent = workingHours > 0 ? (hours / workingHours * 100) : (totalAllHours > 0 ? (hours / totalAllHours * 100) : 0) // 在工作时长中的占比
        const timeRangePercent = params.name === '门开' ? doorPercent :
                                params.name === '有人' ? occupiedPercent :
                                params.name === '空调开' ? acPercent :
                                lightPercent
        return `${params.name}<br/>总时长: ${hours}小时<br/>占比: ${Math.round(relativePercent * 10) / 10}%${isFloorMode ? '' : `<br/>工作时长占比: ${Math.round(workingPercent * 10) / 10}%`}`
      }
    },
    legend: {
      bottom: '5%',
      left: 'center',
      textStyle: {
        color: '#333333',
        fontSize: 12
      },
      formatter: (name: string) => {
        const hours = name === '门开' ? displayTotalHours.door :
                     name === '有人' ? displayTotalHours.occupied :
                     name === '空调开' ? displayTotalHours.ac :
                     displayTotalHours.light
        const workingPercent = workingHours > 0 ? (hours / workingHours * 100) : (totalAllHours > 0 ? (hours / totalAllHours * 100) : 0)
        const timeRangePercent = name === '门开' ? doorPercent :
                                name === '有人' ? occupiedPercent :
                                name === '空调开' ? acPercent :
                                lightPercent
        return `${name} (${hours}h / ${Math.round(workingPercent * 10) / 10}%)`
      }
    },
    series: [
      {
        name: '状态统计',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '35%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#FFFFFF',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          color: '#333333',
          fontSize: 12,
          fontWeight: 'normal',
          position: 'outside'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        // 使用各状态的总时长作为值，饼图会自动计算占比
        // 由于状态可以叠加，占比总和可能超过100%
        data: [
          { 
            value: displayTotalHours.door, 
            name: '门开', 
            itemStyle: { color: '#3E7BFA' } 
          },
          { 
            value: displayTotalHours.occupied, 
            name: '有人', 
            itemStyle: { color: '#52C41A' } 
          },
          { 
            value: displayTotalHours.ac, 
            name: '空调开', 
            itemStyle: { color: '#87CEEB' } 
          },
          { 
            value: displayTotalHours.light, 
            name: '照明开', 
            itemStyle: { color: '#F96418' } 
          }
        ]
      }
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '23%',
        style: {
          text: '统计天数',
          textAlign: 'center',
          fill: '#666666',
          fontSize: 12
        }
      },
      {
        type: 'text',
        left: 'center',
        top: '28%',
        style: {
          text: `${dates.length}天`,
          textAlign: 'center',
          fill: '#3E7BFA',
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      {
        type: 'text',
        left: 'center',
        top: '35%',
        style: {
          text: isFloorMode ? `总时长: ${Math.round(totalAllHours * 10) / 10}h` : `工作时长: ${workingHours}h`,
          textAlign: 'center',
          fill: '#666666',
          fontSize: 11
        }
      },
      {
        type: 'text',
        left: 'center',
        top: '40%',
        style: {
          text: isFloorMode ? `房间数: ${roomCount}` : `占比: ${totalTimeRange > 0 ? Math.round((workingHours / totalTimeRange * 100) * 10) / 10 : 0}%`,
          textAlign: 'center',
          fill: '#999999',
          fontSize: 10
        }
      }
    ]
  }

  const chartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#3E7BFA',
          type: 'dashed'
        }
      },
      formatter: (params: any) => {
        if (params && params.length > 0) {
          const param = params[0]
          const value = param.value
          const dateIndex = value[0]
          const [start, end] = value[1]
          
          const startStr = `${String(Math.floor(start)).padStart(2, '0')}:${String(Math.floor((start % 1) * 60)).padStart(2, '0')}`
          const endStr = `${String(Math.floor(end)).padStart(2, '0')}:${String(Math.floor((end % 1) * 60)).padStart(2, '0')}`
          
          return `${param.seriesName}<br/>${dates[dateIndex]} ${startStr} - ${endStr}`
        }
        return ''
      }
    },
    legend: {
      data: ['门开', '有人', '空调开', '照明开'],
      bottom: 35,
      itemGap: 20,
      textStyle: {
        color: '#333333',
        fontSize: 12
      }
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 100,
        height: 20,
        bottom: 10,
        handleIcon: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.2,10.8,24.1,24.1,24.1C44.2,51.7,55,40.8,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.6-0.4,1-1,1H26c-0.6,0-1-0.4-1-1s0.4-1,1-1h9.9C36.5,34.8,36.9,35.2,36.9,35.8z',
        handleSize: '80%',
        handleStyle: {
          color: '#3E7BFA',
          borderColor: '#3E7BFA'
        },
        textStyle: {
          color: '#666666',
          fontSize: 11
        },
        borderColor: '#EEEEEE',
        fillerColor: 'rgba(62, 123, 250, 0.1)',
        dataBackground: {
          lineStyle: {
            color: '#3E7BFA',
            width: 1
          },
          areaStyle: {
            color: 'rgba(62, 123, 250, 0.05)'
          }
        },
        selectedDataBackground: {
          lineStyle: {
            color: '#3E7BFA',
            width: 2
          },
          areaStyle: {
            color: 'rgba(62, 123, 250, 0.15)'
          }
        }
      },
      {
        type: 'slider',
        show: true,
        yAxisIndex: [0],
        start: 0,
        end: 100,
        width: 20,
        right: 10,
        handleIcon: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.2,10.8,24.1,24.1,24.1C44.2,51.7,55,40.8,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.6-0.4,1-1,1H26c-0.6,0-1-0.4-1-1s0.4-1,1-1h9.9C36.5,34.8,36.9,35.2,36.9,35.8z',
        handleSize: '80%',
        handleStyle: {
          color: '#3E7BFA',
          borderColor: '#3E7BFA'
        },
        textStyle: {
          color: '#666666',
          fontSize: 11
        },
        borderColor: '#EEEEEE',
        fillerColor: 'rgba(62, 123, 250, 0.1)',
        dataBackground: {
          lineStyle: {
            color: '#3E7BFA',
            width: 1
          },
          areaStyle: {
            color: 'rgba(62, 123, 250, 0.05)'
          }
        },
        selectedDataBackground: {
          lineStyle: {
            color: '#3E7BFA',
            width: 2
          },
          areaStyle: {
            color: 'rgba(62, 123, 250, 0.15)'
          }
        }
      },
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: 100,
        zoomOnMouseWheel: true,
        moveOnMouseMove: true,
        moveOnMouseWheel: false
      },
      {
        type: 'inside',
        yAxisIndex: [0],
        start: 0,
        end: 100,
        zoomOnMouseWheel: 'shift',
        moveOnMouseMove: true,
        moveOnMouseWheel: false
      }
    ],
    grid: {
      left: '80px',
      right: '60px',
      bottom: '105px',
      top: '50px',
      containLabel: false
    },
    xAxis: {
      type: 'value',
      name: '时间',
      min: 0,
      max: 24,
      interval: 2,
      axisLabel: {
        formatter: (value: number) => {
          return `${String(value).padStart(2, '0')}:00`
        },
        color: '#666666'
      },
      axisLine: {
        lineStyle: {
          color: '#EEEEEE'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#F5F5F5',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        color: '#666666',
        fontSize: 13,
        margin: 12
      },
      axisLine: {
        lineStyle: {
          color: '#EEEEEE'
        }
      },
      boundaryGap: [0, 0],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#E0E0E0',
          type: 'solid',
          width: 2
        }
      }
    },
    series: [
      {
        name: '门开',
        type: 'custom',
        itemStyle: {
          color: '#3E7BFA'
        },
        renderItem: (params: any, api: any) => {
          const categoryIndex = api.value(0)
          const [start, end] = api.value(1)
          const startCoord = api.coord([start, categoryIndex])
          const endCoord = api.coord([end, categoryIndex])
          const categoryHeight = api.size([0, 1])[1]
          const barHeight = categoryHeight * 0.18
          const offsetY = -barHeight * 1.5
          
          return {
            type: 'rect',
            shape: {
              x: startCoord[0],
              y: startCoord[1] + offsetY,
              width: endCoord[0] - startCoord[0],
              height: barHeight
            },
            style: {
              fill: '#3E7BFA'
            }
          }
        },
        data: doorData
      },
      {
        name: '有人',
        type: 'custom',
        itemStyle: {
          color: '#52C41A'
        },
        renderItem: (params: any, api: any) => {
          const categoryIndex = api.value(0)
          const [start, end] = api.value(1)
          const startCoord = api.coord([start, categoryIndex])
          const endCoord = api.coord([end, categoryIndex])
          const categoryHeight = api.size([0, 1])[1]
          const barHeight = categoryHeight * 0.18
          const offsetY = -barHeight * 0.5
          
          return {
            type: 'rect',
            shape: {
              x: startCoord[0],
              y: startCoord[1] + offsetY,
              width: endCoord[0] - startCoord[0],
              height: barHeight
            },
            style: {
              fill: '#52C41A'
            }
          }
        },
        data: occupiedData
      },
      {
        name: '空调开',
        type: 'custom',
        itemStyle: {
          color: '#87CEEB'
        },
        renderItem: (params: any, api: any) => {
          const categoryIndex = api.value(0)
          const [start, end] = api.value(1)
          const startCoord = api.coord([start, categoryIndex])
          const endCoord = api.coord([end, categoryIndex])
          const categoryHeight = api.size([0, 1])[1]
          const barHeight = categoryHeight * 0.18
          const offsetY = barHeight * 0.5
          
          return {
            type: 'rect',
            shape: {
              x: startCoord[0],
              y: startCoord[1] + offsetY,
              width: endCoord[0] - startCoord[0],
              height: barHeight
            },
            style: {
              fill: '#87CEEB'
            }
          }
        },
        data: acData
      },
      {
        name: '照明开',
        type: 'custom',
        itemStyle: {
          color: '#F96418'
        },
        renderItem: (params: any, api: any) => {
          const categoryIndex = api.value(0)
          const [start, end] = api.value(1)
          const startCoord = api.coord([start, categoryIndex])
          const endCoord = api.coord([end, categoryIndex])
          const categoryHeight = api.size([0, 1])[1]
          const barHeight = categoryHeight * 0.18
          const offsetY = barHeight * 1.5
          
          return {
            type: 'rect',
            shape: {
              x: startCoord[0],
              y: startCoord[1] + offsetY,
              width: endCoord[0] - startCoord[0],
              height: barHeight
            },
            style: {
              fill: '#F96418'
            }
          }
        },
        data: lightData
      }
    ]
  }

  return (
    <div className="status-statistics">
      <div className="statistics-header">
        <h3 className="statistics-title">
          {room ? (
            `${room}状态统计`
          ) : floor ? (
            <>
              {floor}状态统计
              {roomCount && roomCount > 1 && (
                <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#666666', marginLeft: '8px' }}>
                  ({roomCount}个房间)
                </span>
              )}
            </>
          ) : '状态统计'}
        </h3>
        {!isFloorMode && (
          <div className="time-range-selector">
            {timeRanges.map((range) => (
              <button
                key={range}
                className={`time-range-btn ${timeRange === range ? 'active' : ''}`}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        )}
      </div>
      {isFloorMode ? (
        <div className="statistics-charts-container">
          <div className="statistics-chart room-list-chart">
            <div className="room-statistics-list">
              <div className="room-list-header">
                <div 
                  className={`room-header-cell sortable ${sortField === 'name' ? 'active' : ''}`}
                  onClick={() => handleSort('name')}
                >
                  房间名称
                  {sortField === 'name' && (
                    <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
                <div 
                  className={`room-header-cell sortable ${sortField === 'door' ? 'active' : ''}`}
                  onClick={() => handleSort('door')}
                >
                  门开(小时)
                  {sortField === 'door' && (
                    <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
                <div 
                  className={`room-header-cell sortable ${sortField === 'occupied' ? 'active' : ''}`}
                  onClick={() => handleSort('occupied')}
                >
                  有人(小时)
                  {sortField === 'occupied' && (
                    <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
                <div 
                  className={`room-header-cell sortable ${sortField === 'ac' ? 'active' : ''}`}
                  onClick={() => handleSort('ac')}
                >
                  空调开(小时)
                  {sortField === 'ac' && (
                    <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
                <div 
                  className={`room-header-cell sortable ${sortField === 'light' ? 'active' : ''}`}
                  onClick={() => handleSort('light')}
                >
                  照明开(小时)
                  {sortField === 'light' && (
                    <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
                <div 
                  className={`room-header-cell sortable ${sortField === 'energy' ? 'active' : ''}`}
                  onClick={() => handleSort('energy')}
                >
                  用电量(度)
                  {sortField === 'energy' && (
                    <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
                <div 
                  className={`room-header-cell sortable ${sortField === 'power' ? 'active' : ''}`}
                  onClick={() => handleSort('power')}
                >
                  总功率(W)
                  {sortField === 'power' && (
                    <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </div>
              <div className="room-list-body">
                {sortedRoomStatistics.map((room, index) => (
                  <div key={index} className="room-list-row">
                    <div className="room-cell room-name">{room.name}</div>
                    <div className="room-cell">{room.door}</div>
                    <div className="room-cell">{room.occupied}</div>
                    <div className="room-cell">{room.ac}</div>
                    <div className="room-cell">{room.light}</div>
                    <div className="room-cell">{room.energy?.toFixed(1) || '0.0'}</div>
                    <div className="room-cell">{room.power?.toFixed(1) || '0.0'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="statistics-chart pie-chart">
            <ReactECharts option={pieChartOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      ) : (
        <div className="statistics-charts-container">
          <div className="statistics-chart timeline-chart">
            <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
          </div>
          <div className="statistics-chart pie-chart">
            <ReactECharts option={pieChartOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      )}
      <div className="ai-analysis-wrapper">
        <div 
          className="ai-analysis-toggle"
          onClick={() => setAiAnalysisExpanded(!aiAnalysisExpanded)}
        >
          <span className="ai-analysis-toggle-icon">{aiAnalysisExpanded ? '▼' : '▶'}</span>
          <span className="ai-analysis-toggle-text">AI智能分析</span>
        </div>
        {aiAnalysisExpanded && (
          <StatisticsAIAnalysis
            floor={isFloorMode ? floor : undefined}
            room={room}
            roomStatistics={isFloorMode ? roomStatistics : undefined}
            totalHours={!isFloorMode ? displayTotalHours : undefined}
          />
        )}
      </div>
    </div>
  )
}

export default StatusStatistics

