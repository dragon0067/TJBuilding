import express from 'express'
import statisticsController from '../controllers/statisticsController.js'

const router = express.Router()

// 获取楼层统计数据
router.get('/floor', statisticsController.getFloorStatistics)

// 获取房间统计数据
router.get('/room', statisticsController.getRoomStatistics)

// 获取所有楼层列表
router.get('/floors', statisticsController.getFloors)

// 获取指定楼层的房间列表
router.get('/rooms', statisticsController.getRoomsByFloor)

export default router




