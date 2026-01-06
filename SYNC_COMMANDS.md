# Git 同步命令

## 当前修改的文件

主要修改了 `src/components/ACFloorPlan.tsx` 文件，实现了以下功能：

1. ✅ 空调故障监测折线图（表格单元格中的小型折线图）
2. ✅ 故障监测折线图（多维度数据分析区域，显示所有设备的故障趋势）
3. ✅ 区域能效概览柱状图（替换了区域开启率饼图）
4. ✅ 故障设备能耗和成本增加
5. ✅ AI分析维护建议优化
6. ✅ Y轴单位显示优化
7. ✅ 关闭设备也能显示故障信息

## Git 同步步骤

### 1. 检查 Git 状态
```bash
git status
```

### 2. 添加修改的文件
```bash
# 添加所有修改的文件
git add .

# 或者只添加特定文件
git add src/components/ACFloorPlan.tsx
```

### 3. 提交更改
```bash
git commit -m "feat: 完成空调分布图故障监测折线图和能效分析功能

- 添加空调故障监测折线图（表格单元格和数据分析区域）
- 实现区域能效概览柱状图（单位制冷耗电量）
- 优化故障设备能耗和成本计算
- 完善AI分析维护建议
- 修复Y轴单位显示问题
- 确保关闭设备也能显示故障信息"
```

### 4. 推送到远程仓库
```bash
# 推送到主分支
git push origin main

# 或者推送到master分支（根据你的仓库设置）
git push origin master
```

### 5. 如果还没有初始化Git仓库
```bash
# 初始化Git仓库
git init

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/your-username/your-repo.git

# 首次提交
git add .
git commit -m "Initial commit"

# 推送到远程
git push -u origin main
```

## 注意事项

- 确保已安装 Git：https://git-scm.com/downloads
- 确保已配置用户信息：
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```
- 如果遇到路径问题，可以在项目根目录右键选择"Git Bash Here"来执行命令

