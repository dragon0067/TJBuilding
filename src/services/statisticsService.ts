// API基础URL（根据环境配置）
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface RoomStat {
  name: string
  door: number
  occupied: number
  ac: number
  light: number
  energy: number
  power: number
}

export interface TotalHours {
  door: number
  occupied: number
  ac: number
  light: number
}

// 获取楼层统计数据
export async function getFloorStatistics(
  floor: string,
  days: number = 7
): Promise<RoomStat[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/statistics/floor?floor=${encodeURIComponent(floor)}&days=${days}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('网络请求失败')
    }

    const data = await response.json()

    if (data.success) {
      return data.data || []
    } else {
      throw new Error(data.error || '获取统计数据失败')
    }
  } catch (error) {
    console.error('获取楼层统计数据错误:', error)
    // 如果API失败，返回空数组
    return []
  }
}

// 获取房间统计数据
export async function getRoomStatistics(
  room: string,
  days: number = 7
): Promise<TotalHours | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/statistics/room?room=${encodeURIComponent(room)}&days=${days}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('网络请求失败')
    }

    const data = await response.json()

    if (data.success) {
      return data.data || null
    } else {
      throw new Error(data.error || '获取统计数据失败')
    }
  } catch (error) {
    console.error('获取房间统计数据错误:', error)
    // 如果API失败，返回null
    return null
  }
}

