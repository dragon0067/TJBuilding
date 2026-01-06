# 图标设置说明

## 图标已更新

已将所有界面图标替换为智慧楼宇图标。需要将图标文件复制到 `public` 目录。

## 设置步骤

### 方法1: 手动复制（推荐）

1. 在项目根目录创建 `public` 文件夹（如果不存在）
2. 将 `智慧楼宇图标` 文件夹复制到 `public` 目录下

最终目录结构应该是：
```
TJBuilding/
├── public/
│   └── 智慧楼宇图标/
│       ├── 数据大屏/
│       ├── 首页/
│       ├── 设备列表/
│       └── 左侧菜单/
└── ...
```

### 方法2: 使用命令行

**Windows PowerShell:**
```powershell
# 在项目根目录执行
New-Item -ItemType Directory -Force -Path "public"
Copy-Item -Path "智慧楼宇图标" -Destination "public\智慧楼宇图标" -Recurse
```

**Windows CMD:**
```cmd
mkdir public
xcopy /E /I "智慧楼宇图标" "public\智慧楼宇图标"
```

## 已更新的图标

### Header 组件
- ✅ 用户图标：`智慧楼宇图标/左侧菜单/用户.png`

### LeftColumn 组件
- ✅ 温度图标：`智慧楼宇图标/数据大屏/温度.png`
- ✅ 设备数量图标：`智慧楼宇图标/数据大屏/设备数量.png`

### MiddleColumn 组件
- ✅ 用电量图标：`智慧楼宇图标/数据大屏/用电量.png`
- ✅ 总功率图标：`智慧楼宇图标/首页/总功率.png`
- ✅ 照明图标：`智慧楼宇图标/首页/灯开.png`
- ✅ 插座图标：`智慧楼宇图标/设备列表/插座开.png`
- ✅ 人员图标：`智慧楼宇图标/首页/有人.png` 或 `无人.png`（根据占用状态）

## 验证

启动开发服务器后，检查浏览器控制台是否有404错误。如果图标正常显示，说明设置成功。

```bash
npm run dev
```

## 注意事项

- 图标路径使用 `/智慧楼宇图标/...` 格式，这是Vite的public目录访问方式
- 所有图标已设置合适的尺寸（width和height）
- 图标使用 `object-fit: contain` 保持比例


