# Git 同步指南

本指南将帮助你将 TJBuilding 项目同步到 Git 仓库（GitHub、GitLab、Gitee 等）。

## 前置要求

1. **安装 Git**
   - 下载地址：https://git-scm.com/downloads
   - 安装后验证：打开命令行输入 `git --version`

2. **创建远程仓库**
   - GitHub: https://github.com/new
   - GitLab: https://gitlab.com/projects/new
   - Gitee: https://gitee.com/projects/new

## 步骤 1: 初始化 Git 仓库

在项目根目录执行：

```bash
# 初始化 Git 仓库
git init

# 配置用户信息（如果还没配置）
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

## 步骤 2: 添加文件到暂存区

```bash
# 查看当前状态
git status

# 添加所有文件（.gitignore 中配置的文件会被自动忽略）
git add .

# 或者选择性添加文件
git add package.json
git add src/
git add server/
```

## 步骤 3: 提交到本地仓库

```bash
# 创建首次提交
git commit -m "Initial commit: TJBuilding 智慧楼宇项目"

# 或者更详细的提交信息
git commit -m "feat: 初始化项目
- 添加前端 React + TypeScript + Vite 项目
- 添加后端 Express + MySQL 服务器
- 配置数据库连接和 API 接口
- 添加智能助手和统计分析功能"
```

## 步骤 4: 配置身份验证

在推送代码之前，需要配置身份验证。有两种主要方式：

### 方式 1: HTTPS 方式（推荐新手）

#### 4.1 使用 Personal Access Token (PAT) - 推荐

**GitHub:**
1. 登录 GitHub，进入 Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token (classic)"
3. 设置过期时间和权限（至少勾选 `repo` 权限）
4. 生成后复制 token（只显示一次，请妥善保存）

**GitLab:**
1. 登录 GitLab，进入 Preferences → Access Tokens
2. 创建 token，设置权限（至少 `write_repository`）
3. 复制 token

**Gitee:**
1. 登录 Gitee，进入设置 → 安全设置 → 私人令牌
2. 生成新令牌，设置权限
3. 复制 token

**使用 Token 推送：**
```bash
# 添加远程仓库（使用 HTTPS）
git remote add origin https://github.com/你的用户名/TJBuilding.git

# 推送时会提示输入用户名和密码
# 用户名：输入你的 GitHub 用户名
# 密码：输入刚才生成的 Personal Access Token（不是账户密码！）
git push -u origin main
```

#### 4.2 在 URL 中包含 Token（不推荐，但方便）

```bash
# 方式 A: 在 URL 中包含 token（Windows PowerShell 需要转义）
git remote add origin https://你的token@github.com/你的用户名/TJBuilding.git

# 方式 B: 使用 Git Credential Manager（自动保存凭证）
# Windows 和 macOS 通常已安装，首次推送时会弹出窗口要求输入凭证
git push -u origin main
# 输入用户名和 token，Git Credential Manager 会自动保存
```

#### 4.3 手动配置凭证存储

```bash
# Windows - 使用 Windows Credential Manager（默认）
git config --global credential.helper wincred

# macOS - 使用 macOS Keychain
git config --global credential.helper osxkeychain

# Linux - 使用文件存储（不加密，不推荐）
git config --global credential.helper store

# 查看当前配置
git config --global credential.helper
```

### 方式 2: SSH 方式（推荐，更安全）

#### 4.4 生成 SSH 密钥

```bash
# 检查是否已有 SSH 密钥
ls ~/.ssh

# 如果没有，生成新的 SSH 密钥（替换为你的邮箱）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 或者使用 RSA（如果系统不支持 ed25519）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 按提示操作（可以直接回车使用默认路径和空密码）
```

#### 4.5 添加 SSH 密钥到 Git 平台

**GitHub:**
```bash
# 复制公钥内容（Windows PowerShell）
cat ~/.ssh/id_ed25519.pub
# 或
cat ~/.ssh/id_rsa.pub

# 然后：
# 1. 登录 GitHub → Settings → SSH and GPG keys
# 2. 点击 "New SSH key"
# 3. 粘贴公钥内容，保存
```

**GitLab:**
```bash
# 1. 登录 GitLab → Preferences → SSH Keys
# 2. 粘贴公钥内容，保存
```

**Gitee:**
```bash
# 1. 登录 Gitee → 设置 → SSH 公钥
# 2. 粘贴公钥内容，保存
```

#### 4.6 测试 SSH 连接

```bash
# 测试 GitHub 连接
ssh -T git@github.com

# 测试 GitLab 连接
ssh -T git@gitlab.com

# 测试 Gitee 连接
ssh -T git@gitee.com

# 如果看到 "Hi 用户名! You've successfully authenticated..." 说明配置成功
```

#### 4.7 使用 SSH 方式连接远程仓库

```bash
# 添加远程仓库（使用 SSH）
git remote add origin git@github.com:你的用户名/TJBuilding.git

# 或者 GitLab
git remote add origin git@gitlab.com:你的用户名/TJBuilding.git

# 或者 Gitee
git remote add origin git@gitee.com:你的用户名/TJBuilding.git
```

## 步骤 5: 连接远程仓库

```bash
# 根据你选择的方式添加远程仓库

# HTTPS 方式
git remote add origin https://github.com/你的用户名/TJBuilding.git

# 或 SSH 方式（如果已配置 SSH 密钥）
git remote add origin git@github.com:你的用户名/TJBuilding.git

# 查看远程仓库配置
git remote -v

# 如果地址错误，可以修改
git remote set-url origin 新的仓库地址
```

## 步骤 6: 推送到远程仓库

```bash
# 首次推送（设置上游分支）
# 如果使用 HTTPS，会提示输入用户名和密码/token
git push -u origin main

# 或者如果默认分支是 master
git push -u origin master

# 后续推送只需要（如果已配置凭证，不需要再次输入）
git push
```

### 推送时的身份验证提示

**如果使用 HTTPS 方式：**
- 用户名：输入你的 Git 平台用户名
- 密码：输入 Personal Access Token（不是账户密码！）
- 如果配置了 Git Credential Manager，凭证会被保存，下次不需要再输入

**如果使用 SSH 方式：**
- 通常不需要输入密码（如果设置了 SSH 密钥密码，需要输入）
- 首次连接会提示确认主机指纹，输入 `yes` 即可

## 常用 Git 命令

### 查看状态和日志
```bash
# 查看工作区状态
git status

# 查看提交历史
git log

# 查看简洁的提交历史
git log --oneline --graph
```

### 分支管理
```bash
# 创建新分支
git branch feature/新功能

# 切换分支
git checkout feature/新功能

# 创建并切换分支
git checkout -b feature/新功能

# 查看所有分支
git branch -a
```

### 更新和同步
```bash
# 拉取远程更新
git pull

# 拉取远程更新（不合并）
git fetch

# 合并远程分支
git merge origin/main
```

### 撤销操作
```bash
# 撤销工作区的修改（未添加到暂存区）
git checkout -- 文件名

# 撤销暂存区的文件（已 add 但未 commit）
git reset HEAD 文件名

# 修改最后一次提交信息
git commit --amend -m "新的提交信息"
```

## 注意事项

### 1. 不要提交敏感信息

以下文件已被 `.gitignore` 忽略，不会提交到仓库：
- `.env` 文件（包含数据库密码等敏感信息）
- `node_modules/` 目录
- `dist/` 构建输出目录
- 日志文件

### 2. 提交前检查

```bash
# 查看将要提交的文件
git status

# 查看文件变更内容
git diff

# 查看已暂存的文件变更
git diff --cached
```

### 3. 提交规范建议

使用清晰的提交信息：
- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

示例：
```bash
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复数据库连接超时问题"
git commit -m "docs: 更新 README 安装说明"
```

## 身份验证常见问题

### 问题 1: HTTPS 推送时提示 "Authentication failed"

**原因：** 可能使用了账户密码而不是 Personal Access Token

**解决方案：**
```bash
# 清除已保存的凭证
git credential reject
# 然后输入：
# protocol=https
# host=github.com
# （按两次回车）

# Windows 也可以手动删除：
# 控制面板 → 凭据管理器 → Windows 凭据 → 删除相关 Git 凭据

# 重新推送，使用 Personal Access Token 作为密码
git push -u origin main
```

### 问题 2: SSH 连接失败 "Permission denied (publickey)"

**解决方案：**
```bash
# 检查 SSH 密钥是否存在
ls -la ~/.ssh

# 启动 SSH agent
eval "$(ssh-agent -s)"

# 添加 SSH 密钥到 agent
ssh-add ~/.ssh/id_ed25519
# 或
ssh-add ~/.ssh/id_rsa

# 测试连接
ssh -T git@github.com
```

### 问题 3: 忘记 Personal Access Token

**解决方案：**
- GitHub: Settings → Developer settings → Personal access tokens → 重新生成
- GitLab: Preferences → Access Tokens → 创建新 token
- Gitee: 设置 → 安全设置 → 私人令牌 → 重新生成

### 问题 4: 想切换身份验证方式

```bash
# 查看当前远程地址
git remote -v

# 从 HTTPS 切换到 SSH
git remote set-url origin git@github.com:你的用户名/TJBuilding.git

# 从 SSH 切换到 HTTPS
git remote set-url origin https://github.com/你的用户名/TJBuilding.git
```

## 如果遇到问题

### 问题 1: 推送被拒绝
```bash
# 先拉取远程更新
git pull origin main --rebase

# 然后再推送
git push origin main
```

### 问题 2: 修改远程仓库地址
```bash
# 查看当前远程地址
git remote -v

# 修改远程地址
git remote set-url origin 新的仓库地址
```

### 问题 3: 撤销最后一次提交（保留修改）
```bash
git reset --soft HEAD~1
```

### 问题 4: 完全撤销最后一次提交（丢弃修改）
```bash
git reset --hard HEAD~1
```

## 推荐的 Git 工作流程

1. **开发新功能**
   ```bash
   git checkout -b feature/新功能名称
   # 进行开发...
   git add .
   git commit -m "feat: 新功能描述"
   git push origin feature/新功能名称
   ```

2. **修复 Bug**
   ```bash
   git checkout -b fix/bug描述
   # 修复bug...
   git add .
   git commit -m "fix: bug描述"
   git push origin fix/bug描述
   ```

3. **更新主分支**
   ```bash
   git checkout main
   git pull origin main
   git merge feature/新功能名称
   git push origin main
   ```

## 快速开始脚本

### 使用 HTTPS 方式（需要 Personal Access Token）

```bash
# 1. 初始化仓库
git init

# 2. 配置用户信息（如果还没配置）
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"

# 3. 添加所有文件
git add .

# 4. 首次提交
git commit -m "Initial commit: TJBuilding 智慧楼宇项目"

# 5. 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/TJBuilding.git

# 6. 推送到远程（会提示输入用户名和 Personal Access Token）
git branch -M main
git push -u origin main
# 用户名：输入你的 GitHub 用户名
# 密码：输入你的 Personal Access Token
```

### 使用 SSH 方式（需要先配置 SSH 密钥）

```bash
# 1. 生成 SSH 密钥（如果还没有）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. 复制公钥并添加到 GitHub/GitLab/Gitee
cat ~/.ssh/id_ed25519.pub

# 3. 初始化仓库
git init

# 4. 配置用户信息
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"

# 5. 添加所有文件
git add .

# 6. 首次提交
git commit -m "Initial commit: TJBuilding 智慧楼宇项目"

# 7. 添加远程仓库（使用 SSH）
git remote add origin git@github.com:你的用户名/TJBuilding.git

# 8. 推送到远程
git branch -M main
git push -u origin main
```

---

**提示**: 如果使用 GitHub，建议在推送前先在 GitHub 上创建仓库，然后按照步骤 4 和 5 连接并推送。

