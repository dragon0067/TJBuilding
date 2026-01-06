import db from './config/database.js'
import dotenv from 'dotenv'

dotenv.config()

// 从环境变量或默认值获取配置信息（与database.js保持一致）
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '33067'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'security999',
  database: process.env.DB_NAME || 'tjbuilding'
}

console.log('正在测试数据库连接...\n')
console.log('数据库配置:')
console.log(`  Host: ${dbConfig.host}`)
console.log(`  Port: ${dbConfig.port}`)
console.log(`  User: ${dbConfig.user}`)
console.log(`  Database: ${dbConfig.database}`)
console.log('')

async function testConnection() {
  try {
    // 测试连接
    const connection = await db.getConnection()
    console.log('✅ 数据库连接成功！')
    
    // 测试查询
    try {
      const [rows] = await connection.query('SELECT DATABASE() as current_db')
      console.log(`✅ 当前数据库: ${rows[0].current_db}`)
      
      // 检查表是否存在
      const [tables] = await connection.query(
        "SHOW TABLES LIKE 'knowledge_base'"
      )
      
      if (tables.length > 0) {
        console.log('✅ knowledge_base 表已存在')
        
        // 查询知识库数量
        const [count] = await connection.query(
          'SELECT COUNT(*) as count FROM knowledge_base'
        )
        console.log(`✅ 知识库条目数量: ${count[0].count}`)
        
        // 查询启用的知识库数量
        const [activeCount] = await connection.query(
          'SELECT COUNT(*) as count FROM knowledge_base WHERE is_active = 1'
        )
        console.log(`✅ 启用的知识库条目: ${activeCount[0].count}`)
        
        // 查询推荐问题数量
        const [suggestedCount] = await connection.query(
          'SELECT COUNT(*) as count FROM knowledge_base WHERE is_suggested = 1 AND is_active = 1'
        )
        console.log(`✅ 推荐问题数量: ${suggestedCount[0].count}`)
      } else {
        console.log('⚠️  knowledge_base 表不存在，请执行 database/init.sql 初始化数据库')
      }
    } catch (error) {
      console.error('❌ 查询数据库时出错:', error.message)
      if (error.code === 'ER_NO_SUCH_TABLE') {
        console.log('💡 提示: 请执行 database/init.sql 初始化数据库表')
      }
    }
    
    connection.release()
    console.log('\n✅ 数据库连接测试完成！')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ 数据库连接失败！')
    console.error('错误信息:', error.message)
    console.error('错误代码:', error.code)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 可能的原因:')
      console.log('  1. MySQL服务未启动')
      console.log('  2. 端口号配置错误')
      console.log('  3. 防火墙阻止了连接')
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 可能的原因:')
      console.log('  1. 用户名或密码错误')
      console.log('  2. 用户没有访问权限')
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 可能的原因:')
      console.log('  1. 数据库不存在')
      console.log('  2. 请先创建数据库或执行 database/init.sql')
    }
    
    process.exit(1)
  }
}

testConnection()

