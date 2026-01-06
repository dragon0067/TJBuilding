# 新智楼宇能耗大屏

一个现代化的建筑能耗监控大屏界面，展示实时能耗数据、统计分析、趋势图表等信息。

## 功能特性

- 📊 实时能耗数据展示
- 📈 多维度数据可视化（饼图、柱状图、折线图）
- 🏢 分楼层房间能耗详情
- 📱 响应式设计
- 🎨 现代化UI设计

## 技术栈

- React 18
- TypeScript
- Vite
- ECharts (echarts-for-react)

## 安装和运行

### 1. 安装前端依赖

```bash
npm install
```

### 2. 配置后端数据库

1. 进入后端目录：
```bash
cd server
npm install
```

2. 复制环境变量配置文件：
```bash
cp .env.template .env
```

3. 编辑 `.env` 文件，配置MySQL数据库连接：
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tjbuilding
PORT=3001
```

4. 初始化数据库：
```bash
# 使用MySQL命令行
mysql -u root -p < database/init.sql

# 或使用MySQL客户端工具执行 database/init.sql 文件
```

5. 启动后端服务器：
```bash
npm start
# 或开发模式（自动重启）
npm run dev
```

后端服务器将在 `http://localhost:3001` 启动

### 3. 配置前端环境变量（可选）

如果需要修改API地址，创建 `.env` 文件：
```env
VITE_API_URL=http://localhost:3001
```

### 4. 启动前端开发服务器

```bash
# 在项目根目录
npm run dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
├── src/
│   ├── components/
│   │   ├── Header.tsx          # 头部组件
│   │   ├── LeftColumn.tsx      # 左列组件（状态、统计、图表）
│   │   ├── MiddleColumn.tsx    # 中间列组件（房间详情）
│   │   ├── RightColumn.tsx     # 右列组件（分析、排行、趋势）
│   │   ├── ChatAssistant.tsx   # 智能助手组件
│   │   └── AIAnalysis.tsx      # AI分析组件
│   ├── services/
│   │   └── assistantService.ts  # 智能助手服务（API调用）
│   ├── App.tsx                 # 主应用组件
│   ├── main.tsx                # 入口文件
│   └── index.css               # 全局样式
├── server/                     # 后端服务器
│   ├── config/
│   │   └── database.js         # 数据库配置
│   ├── controllers/
│   │   └── assistantController.js  # 助手控制器
│   ├── routes/
│   │   └── assistant.js        # API路由
│   ├── database/
│   │   └── init.sql            # 数据库初始化脚本
│   ├── index.js                # 服务器入口
│   └── package.json            # 后端依赖
├── index.html
├── package.json
└── vite.config.ts
```

## 界面说明

### 头部
- 显示标题"新智楼宇能耗大屏"
- 用户信息和实时时间

### 左列
- 当前状态（温度、设备数量）
- 用电量统计（日/月/周/年）
- 非工作时段用电占比（饼图）
- 近7天设备用电量（柱状图）

### 中间列
- 各楼层房间能耗详情
- 显示室温、用电量、总功率、占用时长等信息
- 高亮显示特殊房间

### 右列
- 用电量分析（照明和空调的当日/当月）
- 空调用电排行（横向柱状图）
- 照明用电排行（横向柱状图）
- 报警趋势（折线图，支持当天/当周/本年度切换）

### 智能助手
- 右下角悬浮按钮，点击打开智能助手
- 可以回答关于系统功能、数据解读、使用指南等问题
- 支持推荐问题快速提问
- 知识库存储在MySQL数据库中，可通过API管理

## 许可证

MIT

