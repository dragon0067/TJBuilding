# 快速启动指南

## 前置要求

1. Node.js (v16+)
2. MySQL (v5.7+ 或 v8.0+)
3. npm 或 yarn

## 步骤1: 安装前端依赖

```bash
# 在项目根目录
npm install
```

## 步骤2: 配置后端

### 2.1 安装后端依赖

```bash
cd server
npm install
```

### 2.2 配置数据库连接

1. 复制环境变量模板：
```bash
cp .env.template .env
```

2. 编辑 `.env` 文件，修改数据库配置：
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的MySQL密码
DB_NAME=tjbuilding
PORT=3001
```

### 2.3 初始化数据库

**方式1: 使用MySQL命令行**
```bash
mysql -u root -p < database/init.sql
```

**方式2: 使用MySQL客户端工具**
- 打开 Navicat、phpMyAdmin 或 MySQL Workbench
- 连接到MySQL服务器
- 执行 `database/init.sql` 文件中的所有SQL语句

**方式3: 手动创建**
```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS tjbuilding DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE tjbuilding;

-- 然后执行 database/init.sql 中的表创建和数据插入语句
```

### 2.4 启动后端服务器

```bash
# 在 server 目录下
npm start
```

看到以下信息表示启动成功：
```
╔════════════════════════════════════════╗
║  TJBuilding Backend Server Started    ║
╠════════════════════════════════════════╣
║  Server: http://localhost:3001        ║
╚════════════════════════════════════════╝
```

## 步骤3: 配置前端（可选）

如果需要修改API地址，在项目根目录创建 `.env` 文件：

```env
VITE_API_URL=http://localhost:3001
```

## 步骤4: 启动前端

```bash
# 在项目根目录
npm run dev
```

前端将在 `http://localhost:3000` 启动

## 验证安装

1. 打开浏览器访问 `http://localhost:3000`
2. 点击右下角的智能助手按钮
3. 尝试提问："这个系统有什么功能？"
4. 如果助手能正常回答，说明安装成功！

## 常见问题

### 数据库连接失败

- 检查MySQL服务是否启动
- 检查 `.env` 文件中的数据库配置是否正确
- 检查数据库用户是否有权限创建数据库和表

### 前端无法连接后端

- 确认后端服务器已启动（`http://localhost:3001`）
- 检查浏览器控制台是否有CORS错误
- 确认 `.env` 文件中的 `VITE_API_URL` 配置正确

### 知识库为空

- 检查数据库是否已正确初始化
- 执行 `SELECT * FROM knowledge_base;` 查看是否有数据
- 如果没有数据，重新执行 `database/init.sql`

## 管理知识库

### 通过API管理

**获取所有知识库条目：**
```bash
GET http://localhost:3001/api/assistant/knowledge
```

**添加新条目：**
```bash
POST http://localhost:3001/api/assistant/knowledge
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

**更新条目：**
```bash
PUT http://localhost:3001/api/assistant/knowledge/:id
```

**删除条目：**
```bash
DELETE http://localhost:3001/api/assistant/knowledge/:id
```

### 直接操作数据库

```sql
-- 查看所有知识库
SELECT * FROM knowledge_base;

-- 添加新知识
INSERT INTO knowledge_base (question, answer, keywords, category, is_suggested) 
VALUES ('问题', '答案', '关键词1,关键词2', '分类', 1);

-- 更新知识
UPDATE knowledge_base 
SET answer = '新答案' 
WHERE id = 1;

-- 删除知识
DELETE FROM knowledge_base WHERE id = 1;
```


