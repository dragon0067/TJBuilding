# SSH 密钥配置步骤（手动操作）

## 步骤 1: 检查是否已有 SSH 密钥

打开 PowerShell，执行：

```powershell
# 检查 .ssh 目录
Test-Path $env:USERPROFILE\.ssh

# 如果存在，查看现有密钥
Get-ChildItem $env:USERPROFILE\.ssh
```

如果看到 `id_ed25519` 或 `id_rsa` 文件，说明已有密钥，跳到步骤 3。

## 步骤 2: 生成新的 SSH 密钥

在 PowerShell 中执行（替换为你的邮箱）：

```powershell
ssh-keygen -t ed25519 -C "your_email@example.com"
```

**提示：**
- 保存路径：直接回车（使用默认路径 `C:\Users\你的用户名\.ssh\id_ed25519`）
- 密码：可以设置密码保护密钥，或直接回车跳过（推荐设置密码）

## 步骤 3: 查看并复制公钥

```powershell
# 显示公钥内容
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```

**复制输出的完整内容**（从 `ssh-ed25519` 开始到邮箱结束）

## 步骤 4: 将公钥添加到 Git 平台

### GitHub
1. 访问：https://github.com/settings/ssh/new
2. Title: 输入描述（如：`My Computer`）
3. Key: 粘贴刚才复制的公钥
4. 点击 **Add SSH key**

### GitLab
1. 访问：https://gitlab.com/-/profile/keys
2. Key: 粘贴公钥
3. Title: 输入描述
4. 点击 **Add key**

### Gitee
1. 访问：https://gitee.com/profile/sshkeys
2. 标题: 输入描述
3. 公钥: 粘贴公钥
4. 点击 **确定**

## 步骤 5: 测试 SSH 连接

```powershell
# 测试 GitHub
ssh -T git@github.com

# 测试 GitLab
ssh -T git@gitlab.com

# 测试 Gitee
ssh -T git@gitee.com
```

如果看到 `Hi 用户名! You've successfully authenticated...` 说明配置成功！

## 步骤 6: 配置项目使用 SSH

在项目目录执行：

```powershell
# 查看当前远程地址
git remote -v

# 如果还没有添加远程仓库，添加 SSH 地址
git remote add origin git@github.com:你的用户名/TJBuilding.git

# 如果已有 HTTPS 地址，切换到 SSH
git remote set-url origin git@github.com:你的用户名/TJBuilding.git

# 验证
git remote -v
```

## 步骤 7: 推送代码

```powershell
git push -u origin main
```

现在不需要输入密码了（如果设置了密钥密码，需要输入密钥密码）。

---

## 快速命令汇总

```powershell
# 1. 生成密钥（替换邮箱）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. 显示公钥（复制输出）
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub

# 3. 测试连接
ssh -T git@github.com

# 4. 配置项目使用 SSH
git remote set-url origin git@github.com:你的用户名/TJBuilding.git

# 5. 推送
git push -u origin main
```

