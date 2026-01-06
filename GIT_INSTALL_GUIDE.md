# Git 安装和配置指南

## 问题诊断

你遇到的错误：`无法将"git"项识别为 cmdlet、函数、脚本文件或可运行程序的名称`

这通常意味着：
1. Git 没有安装
2. Git 已安装但未添加到 PATH 环境变量
3. PowerShell 需要重新启动以加载新的环境变量

---

## 解决方案

### 方案 1: 检查 Git 是否已安装（但 PATH 未更新）

#### 步骤 1: 检查常见安装位置

在 PowerShell 中执行：

```powershell
# 检查常见安装位置
Test-Path "C:\Program Files\Git\bin\git.exe"
Test-Path "C:\Program Files (x86)\Git\bin\git.exe"
Test-Path "$env:LOCALAPPDATA\Programs\Git\bin\git.exe"

# 搜索 Git 可执行文件
Get-ChildItem -Path "C:\Program Files" -Filter "git.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object FullName
```

#### 步骤 2: 如果找到 Git，临时添加到 PATH

```powershell
# 临时添加到当前会话的 PATH（关闭 PowerShell 后失效）
$env:PATH += ";C:\Program Files\Git\bin"

# 验证
git --version
```

#### 步骤 3: 永久添加到 PATH（推荐）

1. 按 `Win + R`，输入 `sysdm.cpl`，回车
2. 点击"高级"选项卡
3. 点击"环境变量"
4. 在"系统变量"中找到 `Path`，点击"编辑"
5. 点击"新建"，添加 Git 的 bin 目录路径（如：`C:\Program Files\Git\bin`）
6. 点击"确定"保存
7. **重新打开 PowerShell**（重要！）

---

### 方案 2: 安装 Git（如果未安装）

#### 方法 A: 使用官方安装程序（推荐）

1. **下载 Git for Windows**
   - 访问：https://git-scm.com/download/win
   - 或直接下载：https://github.com/git-for-windows/git/releases/latest

2. **安装步骤**
   - 运行下载的安装程序（如：`Git-2.x.x-64-bit.exe`）
   - 安装选项建议：
     - ✅ 添加到 PATH（重要！）
     - ✅ Git Bash Here
     - ✅ Git GUI Here
     - ✅ 使用 OpenSSL
   - 其他选项使用默认即可
   - 点击"安装"

3. **验证安装**
   - **关闭当前 PowerShell 窗口**
   - **重新打开 PowerShell**
   - 执行：`git --version`

#### 方法 B: 使用包管理器（如果已安装）

**使用 Chocolatey：**
```powershell
choco install git
```

**使用 Winget（Windows 10/11）：**
```powershell
winget install --id Git.Git -e --source winget
```

**使用 Scoop：**
```powershell
scoop install git
```

---

### 方案 3: 使用 Git Bash（临时方案）

如果 Git 已安装但 PowerShell 无法识别，可以使用 Git Bash：

1. 在项目文件夹右键
2. 选择"Git Bash Here"
3. 在 Git Bash 中执行 Git 命令

---

## 安装后配置

### 1. 配置用户信息

```powershell
git config --global user.name "你的名字"
git config --global user.email "your_email@example.com"
```

### 2. 验证配置

```powershell
git config --list
git --version
```

### 3. 测试 SSH（你已经配置好了）

```powershell
ssh -T git@github.com
```

---

## 快速检查清单

- [ ] Git 已安装
- [ ] Git 已添加到 PATH 环境变量
- [ ] 已重新打开 PowerShell（使 PATH 生效）
- [ ] `git --version` 命令可以执行
- [ ] 已配置用户信息
- [ ] SSH 密钥已配置（✅ 已完成）

---

## 常见问题

### Q: 安装后仍然无法识别 Git 命令

**解决：**
1. 确认安装时选择了"添加到 PATH"
2. 完全关闭并重新打开 PowerShell（不要只是刷新）
3. 检查 PATH：`$env:PATH -split ';' | Select-String git`
4. 手动添加到 PATH（见方案 1 步骤 3）

### Q: 如何检查 Git 版本？

```powershell
git --version
```

### Q: 如何查看 Git 安装位置？

```powershell
where.exe git
# 或
Get-Command git | Select-Object Source
```

---

## 安装完成后继续

安装并配置好 Git 后，继续执行以下步骤：

```powershell
# 1. 初始化仓库
git init

# 2. 添加文件
git add .

# 3. 首次提交
git commit -m "Initial commit: TJBuilding 智慧楼宇项目"

# 4. 添加远程仓库（使用 SSH）
git remote add origin git@github.com:dragon0067/TJBuilding.git

# 5. 推送
git branch -M main
git push -u origin main
```

---

**提示：** 如果 Git 已安装但 PowerShell 无法识别，最简单的方法是**重新打开 PowerShell 窗口**，或者使用 **Git Bash**。

