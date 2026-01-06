# TJBuilding 后端API服务器

## 功能

- 智能助手知识库管理
- MySQL数据库集成
- RESTful API接口

## 安装

```bash
cd server
npm install
```

## 配置

1. 复制 `.env.example` 为 `.env`
2. 修改数据库配置：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tjbuilding
PORT=3001
```

## 初始化数据库

1. 确保MySQL服务已启动
2. 执行SQL脚本：

```bash
mysql -u root -p < database/init.sql
```

或者使用MySQL客户端工具执行 `database/init.sql` 文件

## 启动服务器

```bash
npm start
```

开发模式（自动重启）：

```bash
npm run dev
```

服务器将在 `http://localhost:3001` 启动

## API接口

### 1. 获取助手回答

```bash
POST /api/assistant/ask
Content-Type: application/json

{
  "question": "这个系统有什么功能？"
}
```

### 2. 获取推荐问题

```bash
GET /api/assistant/suggestions
```

### 3. 获取所有知识库条目

```bash
GET /api/assistant/knowledge
```

### 4. 添加知识库条目

```bash
POST /api/assistant/knowledge
Content-Type: application/json

{
  "question": "新问题",
  "answer": "新答案",
  "keywords": "关键词1,关键词2",
  "category": "分类",
  "is_suggested": true,
  "sort_order": 0
}
```

### 5. 更新知识库条目

```bash
PUT /api/assistant/knowledge/:id
Content-Type: application/json

{
  "question": "更新后的问题",
  "answer": "更新后的答案",
  "keywords": "关键词1,关键词2",
  "category": "分类",
  "is_suggested": true,
  "sort_order": 0,
  "is_active": true
}
```

### 6. 删除知识库条目

```bash
DELETE /api/assistant/knowledge/:id
```

## 数据库表结构

### knowledge_base 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| question | VARCHAR(500) | 问题 |
| answer | TEXT | 答案 |
| keywords | VARCHAR(1000) | 关键词（逗号分隔） |
| category | VARCHAR(50) | 分类 |
| is_suggested | TINYINT(1) | 是否推荐问题 |
| is_active | TINYINT(1) | 是否启用 |
| sort_order | INT | 排序顺序 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |


