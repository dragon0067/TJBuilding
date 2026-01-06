# Git 身份验证快速参考

## 🔐 两种身份验证方式对比

| 方式 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **HTTPS + PAT** | 配置简单，跨平台 | Token 需要定期更新 | 新手、临时使用 |
| **SSH** | 更安全，一次配置长期使用 | 需要生成密钥 | 长期开发、团队协作 |

---

## 🚀 方式 1: HTTPS + Personal Access Token（推荐新手）

### 步骤 1: 生成 Personal Access Token

#### GitHub
1. 登录 GitHub → 点击头像 → **Settings**
2. 左侧菜单 → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. 点击 **Generate new token (classic)**
5. 设置：
   - Note: `TJBuilding Project`（描述用途）
   - Expiration: 选择过期时间（建议 90 天或自定义）
   - 权限：至少勾选 ✅ **repo**（完整仓库权限）
6. 点击 **Generate token**
7. ⚠️ **立即复制 token**（只显示一次！格式类似：`ghp_xxxxxxxxxxxxxxxxxxxx`）

#### GitLab
1. 登录 GitLab → 点击头像 → **Preferences**
2. 左侧菜单 → **Access Tokens**
3. 填写：
   - Token name: `TJBuilding Project`
   - Expiration date: 选择日期
   - 权限：至少勾选 ✅ **write_repository**
4. 点击 **Create personal access token**
5. ⚠️ **立即复制 token**

#### Gitee
1. 登录 Gitee → 点击头像 → **设置**
2. 左侧菜单 → **安全设置** → **私人令牌**
3. 点击 **生成新令牌**
4. 设置：
   - 描述：`TJBuilding Project`
   - 权限：至少勾选 ✅ **projects**（项目权限）
5. 点击 **提交**
6. ⚠️ **立即复制 token**

### 步骤 2: 使用 Token 推送代码

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/TJBuilding.git

# 推送代码
git push -u origin main

# 当提示输入时：
# Username: 输入你的 GitHub 用户名
# Password: 输入刚才复制的 Personal Access Token（不是账户密码！）
```

### 步骤 3: 保存凭证（可选，避免每次都输入）

```bash
# Windows - 使用 Windows Credential Manager（推荐）
git config --global credential.helper wincred

# macOS - 使用 Keychain
git config --global credential.helper osxkeychain

# Linux - 使用文件存储（不推荐，不安全）
git config --global credential.helper store
```

**之后推送时，凭证会自动保存，不需要再次输入。**

---

## 🔑 方式 2: SSH 密钥（推荐长期使用）

### 步骤 1: 生成 SSH 密钥

```bash
# 检查是否已有 SSH 密钥
ls ~/.ssh

# 如果没有，生成新密钥（替换为你的邮箱）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 按提示操作：
# - 保存路径：直接回车（使用默认 ~/.ssh/id_ed25519）
# - 密码：可以设置密码或直接回车（空密码）
```

**如果系统不支持 ed25519，使用 RSA：**
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

### 步骤 2: 复制公钥

**Windows (PowerShell):**
```powershell
cat ~/.ssh/id_ed25519.pub
# 或
cat ~/.ssh/id_rsa.pub
```

**Windows (CMD):**
```cmd
type %USERPROFILE%\.ssh\id_ed25519.pub
```

**macOS / Linux:**
```bash
cat ~/.ssh/id_ed25519.pub
```

**复制输出的完整内容**（从 `ssh-ed25519` 或 `ssh-rsa` 开始到邮箱结束）

### 步骤 3: 添加公钥到 Git 平台

#### GitHub
1. 登录 GitHub → 点击头像 → **Settings**
2. 左侧菜单 → **SSH and GPG keys**
3. 点击 **New SSH key**
4. Title: `My Computer`（任意描述）
5. Key: 粘贴刚才复制的公钥
6. 点击 **Add SSH key**

#### GitLab
1. 登录 GitLab → 点击头像 → **Preferences**
2. 左侧菜单 → **SSH Keys**
3. Key: 粘贴公钥
4. Title: `My Computer`
5. 点击 **Add key**

#### Gitee
1. 登录 Gitee → 点击头像 → **设置**
2. 左侧菜单 → **SSH 公钥**
3. 标题: `My Computer`
4. 公钥: 粘贴公钥
5. 点击 **确定**

### 步骤 4: 测试 SSH 连接

```bash
# 测试 GitHub
ssh -T git@github.com
# 看到 "Hi 用户名! You've successfully authenticated..." 说明成功

# 测试 GitLab
ssh -T git@gitlab.com

# 测试 Gitee
ssh -T git@gitee.com
```

### 步骤 5: 使用 SSH 方式连接仓库

```bash
# 添加远程仓库（使用 SSH）
git remote add origin git@github.com:你的用户名/TJBuilding.git

# 推送代码（不需要输入密码）
git push -u origin main
```

---

## ❓ 常见问题

### Q1: 推送时提示 "Authentication failed"

**原因：** 使用了账户密码而不是 Personal Access Token

**解决：**
```bash
# 清除已保存的凭证
git credential reject
# 输入：
# protocol=https
# host=github.com
# （按两次回车）

# Windows 也可以：
# 控制面板 → 凭据管理器 → Windows 凭据 → 删除相关 Git 凭据

# 重新推送，使用 Personal Access Token
git push -u origin main
```

### Q2: SSH 连接失败 "Permission denied (publickey)"

**解决：**
```bash
# 启动 SSH agent
eval "$(ssh-agent -s)"

# 添加密钥到 agent
ssh-add ~/.ssh/id_ed25519

# 重新测试
ssh -T git@github.com
```

### Q3: 如何切换身份验证方式？

```bash
# 查看当前远程地址
git remote -v

# 从 HTTPS 切换到 SSH
git remote set-url origin git@github.com:你的用户名/TJBuilding.git

# 从 SSH 切换到 HTTPS
git remote set-url origin https://github.com/你的用户名/TJBuilding.git
```

### Q4: Token 过期了怎么办？

重新生成新的 Personal Access Token，然后：
```bash
# 清除旧凭证
git credential reject
# 输入 protocol=https 和 host=github.com，按两次回车

# 重新推送，输入新的 token
git push
```

---

## 📝 快速检查清单

### HTTPS 方式
- [ ] 已生成 Personal Access Token
- [ ] 已复制并保存 token
- [ ] 已配置 credential helper（可选）
- [ ] 推送时使用 token 作为密码

### SSH 方式
- [ ] 已生成 SSH 密钥对
- [ ] 已复制公钥内容
- [ ] 已将公钥添加到 Git 平台
- [ ] 已测试 SSH 连接成功
- [ ] 远程仓库地址使用 SSH 格式（git@...）

---

**💡 提示：** 如果只是临时使用，推荐 HTTPS + PAT 方式。如果是长期开发，推荐配置 SSH 密钥。


