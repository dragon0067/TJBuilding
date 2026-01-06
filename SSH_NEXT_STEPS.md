# SSH 配置成功！下一步操作

## ✅ SSH 配置已完成

你已经成功配置了 SSH 密钥，GitHub 认证通过！

**你的 GitHub 用户名：** dragon0067

---

## 📋 接下来的步骤

### 步骤 1: 初始化 Git 仓库（如果还没有）

在项目目录执行：

```powershell
# 初始化 Git 仓库
git init

# 配置用户信息（如果还没配置）
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

### 步骤 2: 添加文件到暂存区

```powershell
# 查看当前状态
git status

# 添加所有文件
git add .

# 或者选择性添加
git add package.json
git add src/
git add server/
```

### 步骤 3: 创建首次提交

```powershell
git commit -m "Initial commit: TJBuilding 智慧楼宇项目"
```

### 步骤 4: 添加远程仓库（使用 SSH）

```powershell
# 添加远程仓库（使用 SSH 地址）
git remote add origin git@github.com:dragon0067/TJBuilding.git

# 或者如果仓库名不同，替换为你的实际仓库名
# git remote add origin git@github.com:dragon0067/你的仓库名.git

# 查看远程仓库配置
git remote -v
```

**注意：** 请确保在 GitHub 上已经创建了名为 `TJBuilding` 的仓库。如果没有，请先创建：
- 访问：https://github.com/new
- 仓库名：`TJBuilding`（或你喜欢的名字）
- 选择 Public 或 Private
- 不要初始化 README、.gitignore 或 license（因为本地已有文件）
- 点击 Create repository

### 步骤 5: 推送到远程仓库

```powershell
# 设置主分支为 main（如果默认是 master，改为 master）
git branch -M main

# 推送到远程仓库
git push -u origin main
```

现在推送时**不需要输入密码**了！🎉

---

## 🔄 如果远程仓库已存在

如果远程仓库已经存在并且有内容，可能需要先拉取：

```powershell
# 先拉取远程内容
git pull origin main --allow-unrelated-histories

# 然后再推送
git push -u origin main
```

---

## 📝 常用命令

```powershell
# 查看状态
git status

# 查看远程仓库
git remote -v

# 修改远程仓库地址（如果需要）
git remote set-url origin git@github.com:dragon0067/TJBuilding.git

# 查看提交历史
git log --oneline
```

---

## ✅ 验证配置

执行以下命令验证一切正常：

```powershell
# 1. 检查 Git 配置
git config --list

# 2. 检查远程仓库
git remote -v

# 3. 测试推送（会显示推送信息）
git push -u origin main
```

---

## 🎉 完成！

配置完成后，你就可以：
- ✅ 使用 `git push` 推送代码（无需密码）
- ✅ 使用 `git pull` 拉取更新
- ✅ 使用 SSH 方式安全地同步代码

**提示：** 如果设置了 SSH 密钥密码，每次推送时可能需要输入密钥密码（不是 GitHub 密码）。

