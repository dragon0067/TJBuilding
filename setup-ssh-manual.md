# SSH 配置 - 手动命令步骤

如果脚本无法运行，请按以下步骤手动执行：

## 步骤 1: 生成 SSH 密钥

```powershell
ssh-keygen -t ed25519 -C "your_email@example.com"
```

**提示：**
- 保存路径：直接回车（使用默认 `C:\Users\你的用户名\.ssh\id_ed25519`）
- 密码：可以设置密码保护密钥，或直接回车跳过

## 步骤 2: 查看公钥

```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```

**复制输出的完整内容**（从 `ssh-ed25519` 开始到邮箱结束）

## 步骤 3: 添加到 Git 平台

### GitHub
1. 访问：https://github.com/settings/ssh/new
2. Title: `My Computer`
3. Key: 粘贴公钥
4. 点击 **Add SSH key**

### GitLab  
1. 访问：https://gitlab.com/-/profile/keys
2. Key: 粘贴公钥
3. Title: `My Computer`
4. 点击 **Add key**

### Gitee
1. 访问：https://gitee.com/profile/sshkeys
2. 标题: `My Computer`
3. 公钥: 粘贴公钥
4. 点击 **确定**

## 步骤 4: 测试连接

```powershell
ssh -T git@github.com
```

如果看到 `Hi 用户名! You've successfully authenticated...` 说明成功！

## 步骤 5: 配置项目使用 SSH

```powershell
# 如果还没有远程仓库
git remote add origin git@github.com:你的用户名/TJBuilding.git

# 如果已有 HTTPS 地址，切换到 SSH
git remote set-url origin git@github.com:你的用户名/TJBuilding.git

# 验证
git remote -v
```

## 步骤 6: 推送代码

```powershell
git push -u origin main
```

完成！

