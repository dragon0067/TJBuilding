# SSH 密钥配置脚本

Write-Host ""
Write-Host "=== Git SSH 密钥配置 ===" -ForegroundColor Cyan
Write-Host ""

# 检查并创建 .ssh 目录
$sshPath = "$env:USERPROFILE\.ssh"
if (-not (Test-Path $sshPath)) {
    New-Item -ItemType Directory -Path $sshPath -Force | Out-Null
    Write-Host "已创建 SSH 目录" -ForegroundColor Green
}

# 检查现有密钥
$keyFile = "$sshPath\id_ed25519"
if (Test-Path $keyFile) {
    Write-Host ""
    Write-Host "发现现有密钥: $keyFile" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "公钥内容：" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Get-Content "$keyFile.pub"
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host ""
    Write-Host "如果这是你想要的密钥，请复制上面的公钥内容" -ForegroundColor Yellow
    $choice = Read-Host "使用现有密钥？(Y/N，默认Y)"
    if ($choice -ne "N" -and $choice -ne "n") {
        Write-Host ""
        Write-Host "使用现有密钥" -ForegroundColor Green
        Write-Host ""
        Write-Host "请将上面的公钥添加到 GitHub/GitLab/Gitee" -ForegroundColor Yellow
        exit 0
    }
}

# 获取邮箱
Write-Host ""
Write-Host "请输入你的邮箱地址（用于标识密钥）：" -ForegroundColor Yellow
$email = Read-Host "邮箱"
if ([string]::IsNullOrWhiteSpace($email)) {
    Write-Host "错误: 邮箱不能为空" -ForegroundColor Red
    exit 1
}

# 生成密钥
Write-Host ""
Write-Host "正在生成 SSH 密钥..." -ForegroundColor Yellow
Write-Host "提示: 可以设置密码保护密钥，或直接回车跳过" -ForegroundColor Gray
Write-Host ""

ssh-keygen -t ed25519 -C $email -f $keyFile

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SSH 密钥生成成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  你的公钥（请复制）" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    $pubKey = Get-Content "$keyFile.pub"
    Write-Host $pubKey -ForegroundColor Yellow
    Write-Host ""
    
    # 尝试复制到剪贴板
    try {
        $pubKey | Set-Clipboard
        Write-Host "公钥已复制到剪贴板！" -ForegroundColor Green
    }
    catch {
        Write-Host "请手动复制上面的公钥" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  添加到 Git 平台" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "GitHub: https://github.com/settings/ssh/new" -ForegroundColor Cyan
    Write-Host "GitLab: https://gitlab.com/-/profile/keys" -ForegroundColor Cyan
    Write-Host "Gitee:  https://gitee.com/profile/sshkeys" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "添加后按回车键测试连接..." -ForegroundColor Yellow
    Read-Host
    
    Write-Host ""
    Write-Host "测试 GitHub 连接..." -ForegroundColor Yellow
    $sshOutput = ssh -T git@github.com 2>&1
    $outputText = $sshOutput | Out-String
    
    if ($outputText -match "successfully authenticated") {
        Write-Host "GitHub 连接成功！" -ForegroundColor Green
    }
    else {
        if ($outputText -match "Permission denied") {
            Write-Host "连接失败，请确认已添加公钥" -ForegroundColor Red
        }
        else {
            Write-Host $outputText -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    Write-Host "配置完成！现在可以使用 SSH 方式连接仓库了" -ForegroundColor Green
    Write-Host ""
    Write-Host "使用以下命令配置项目：" -ForegroundColor Yellow
    Write-Host "git remote set-url origin git@github.com:你的用户名/TJBuilding.git" -ForegroundColor Cyan
}
else {
    Write-Host ""
    Write-Host "密钥生成失败" -ForegroundColor Red
}
