import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import assistantRoutes from './routes/assistant.js'
import statisticsRoutes from './routes/statistics.js'
import db from './config/database.js'

// 加载环境变量
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 测试数据库连接
db.getConnection()
  .then(connection => {
    console.log('✅ 数据库连接成功')
    connection.release()
  })
  .catch(err => {
    console.error('❌ 数据库连接失败:', err.message)
    console.log('💡 请检查数据库配置（config/database.js 或 .env 文件）')
    console.log('💡 当前配置:')
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`)
    console.log(`   Port: ${process.env.DB_PORT || '33067'}`)
    console.log(`   User: ${process.env.DB_USER || 'root'}`)
    console.log(`   Database: ${process.env.DB_NAME || 'tjbuilding'}`)
  })

// 路由
app.use('/api/assistant', assistantRoutes)
app.use('/api/statistics', statisticsRoutes)

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'TJBuilding Backend API'
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  TJBuilding Backend Server Started    ║
╠════════════════════════════════════════╣
║  Server: http://localhost:${PORT}${' '.repeat(Math.max(0, 15 - PORT.toString().length))}║
║  Health: http://localhost:${PORT}/health${' '.repeat(Math.max(0, 9 - PORT.toString().length))}║
╚════════════════════════════════════════╝
  `)
})

