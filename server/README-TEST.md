# 数据库连接测试说明

## 当前配置

根据 `config/database.js` 文件，当前数据库配置为：

- **Host**: localhost
- **Port**: 33067
- **User**: root
- **Password**: security999
- **Database**: tjbuilding

## 测试方法

### 方法1: 启动服务器自动测试

服务器启动时会自动测试数据库连接：

```bash
cd server
npm start
```

如果连接成功，会显示：
```
✅ 数据库连接成功
```

如果连接失败，会显示错误信息和当前配置。

### 方法2: 使用测试脚本

运行测试脚本：

```bash
cd server
node test-db-connection.js
```

测试脚本会：
1. 显示当前数据库配置
2. 测试数据库连接
3. 检查 knowledge_base 表是否存在
4. 统计知识库条目数量

### 方法3: 手动测试API

启动服务器后，访问健康检查接口：

```bash
curl http://localhost:3001/health
```

然后测试助手API：

```bash
curl -X POST http://localhost:3001/api/assistant/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"这个系统有什么功能？"}'
```

## 常见问题

### 连接失败

如果看到 `ECONNREFUSED` 错误：
- 检查MySQL服务是否启动
- 确认端口号 33067 是否正确
- 检查防火墙设置

如果看到 `ER_ACCESS_DENIED_ERROR` 错误：
- 检查用户名和密码是否正确
- 确认用户有访问权限

如果看到 `ER_BAD_DB_ERROR` 错误：
- 数据库不存在，需要先执行 `database/init.sql` 初始化数据库

### 修改配置

如果需要修改配置，有两种方式：

1. **修改代码中的默认值**（`config/database.js`）
2. **创建 `.env` 文件**（推荐）

创建 `server/.env` 文件：
```env
DB_HOST=localhost
DB_PORT=33067
DB_USER=root
DB_PASSWORD=security999
DB_NAME=tjbuilding
PORT=3001
```

环境变量会覆盖代码中的默认值。


