import db from '../config/database.js'

// 获取楼层房间统计数据
export const getFloorStatistics = async (req, res) => {
  try {
    const { floor, days = 7 } = req.query
    
    if (!floor) {
      return res.status(400).json({
        success: false,
        error: '缺少楼层参数'
      })
    }

    // 获取该楼层的所有房间
    const [rooms] = await db.execute(
      'SELECT id, floor, name FROM rooms WHERE floor = ?',
      [floor]
    )

    if (rooms.length === 0) {
      return res.json({
        success: true,
        data: []
      })
    }

    const roomIds = rooms.map(r => r.id)
    const placeholders = roomIds.map(() => '?').join(',')

    // 获取指定天数内的统计数据
    const [statistics] = await db.execute(
      `SELECT 
        rs.room_id,
        r.name,
        r.floor,
        SUM(rs.door_hours) as door,
        SUM(rs.occupied_hours) as occupied,
        SUM(rs.ac_hours) as ac,
        SUM(rs.light_hours) as light,
        SUM(rs.energy) as energy,
        AVG(rs.power) as power
      FROM room_statistics rs
      INNER JOIN rooms r ON rs.room_id = r.id
      WHERE rs.room_id IN (${placeholders})
        AND rs.date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY rs.room_id, r.name, r.floor
      ORDER BY r.name`,
      [...roomIds, parseInt(days)]
    )

    res.json({
      success: true,
      data: statistics.map(stat => ({
        name: stat.name,
        door: parseFloat(stat.door) || 0,
        occupied: parseFloat(stat.occupied) || 0,
        ac: parseFloat(stat.ac) || 0,
        light: parseFloat(stat.light) || 0,
        energy: parseFloat(stat.energy) || 0,
        power: parseFloat(stat.power) || 0
      }))
    })
  } catch (error) {
    console.error('获取楼层统计数据错误:', error)
    res.status(500).json({
      success: false,
      error: '获取统计数据失败'
    })
  }
}

// 获取单个房间统计数据
export const getRoomStatistics = async (req, res) => {
  try {
    const { room, days = 7 } = req.query
    
    if (!room) {
      return res.status(400).json({
        success: false,
        error: '缺少房间参数'
      })
    }

    // 查找房间
    const [rooms] = await db.execute(
      'SELECT id FROM rooms WHERE name = ? LIMIT 1',
      [room]
    )

    if (rooms.length === 0) {
      return res.json({
        success: true,
        data: {
          door: 0,
          occupied: 0,
          ac: 0,
          light: 0
        }
      })
    }

    const roomId = rooms[0].id

    // 获取指定天数内的统计数据
    const [statistics] = await db.execute(
      `SELECT 
        SUM(door_hours) as door,
        SUM(occupied_hours) as occupied,
        SUM(ac_hours) as ac,
        SUM(light_hours) as light
      FROM room_statistics
      WHERE room_id = ?
        AND date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)`,
      [roomId, parseInt(days)]
    )

    const stat = statistics[0] || {}

    res.json({
      success: true,
      data: {
        door: parseFloat(stat.door) || 0,
        occupied: parseFloat(stat.occupied) || 0,
        ac: parseFloat(stat.ac) || 0,
        light: parseFloat(stat.light) || 0
      }
    })
  } catch (error) {
    console.error('获取房间统计数据错误:', error)
    res.status(500).json({
      success: false,
      error: '获取统计数据失败'
    })
  }
}

// 获取所有楼层列表
export const getFloors = async (req, res) => {
  try {
    const [floors] = await db.execute(
      'SELECT DISTINCT floor FROM rooms ORDER BY floor'
    )

    res.json({
      success: true,
      data: floors.map(f => f.floor)
    })
  } catch (error) {
    console.error('获取楼层列表错误:', error)
    res.status(500).json({
      success: false,
      error: '获取楼层列表失败'
    })
  }
}

// 获取指定楼层的房间列表
export const getRoomsByFloor = async (req, res) => {
  try {
    const { floor } = req.query
    
    if (!floor) {
      return res.status(400).json({
        success: false,
        error: '缺少楼层参数'
      })
    }

    const [rooms] = await db.execute(
      'SELECT id, name FROM rooms WHERE floor = ? ORDER BY name',
      [floor]
    )

    res.json({
      success: true,
      data: rooms.map(r => ({ id: r.id, name: r.name }))
    })
  } catch (error) {
    console.error('获取房间列表错误:', error)
    res.status(500).json({
      success: false,
      error: '获取房间列表失败'
    })
  }
}

