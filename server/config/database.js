import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

// 创建连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '33067'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'security999',
  database: process.env.DB_NAME || 'tjbuilding',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})

// 导出连接池和原始mysql（用于创建数据库）
export default pool
export { mysql }


