# 简单的 SSH 密钥配置脚本

Write-Host "`n=== Git SSH 密钥配置 ===" -ForegroundColor Cyan

# 检查并创建 .ssh 目录
$sshPath = "$env:USERPROFILE\.ssh"
if (-not (Test-Path $sshPath)) {
    New-Item -ItemType Directory -Path $sshPath -Force | Out-Null
    Write-Host "✓ 已创建 SSH 目录" -ForegroundColor Green
}

# 检查现有密钥
$keyFile = "$sshPath\id_ed25519"
if (Test-Path $keyFile) {
    Write-Host "`n发现现有密钥: $keyFile" -ForegroundColor Yellow
    Write-Host "`n公钥内容：" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Get-Content "$keyFile.pub"
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host "`n如果这是你想要的密钥，请复制上面的公钥内容" -ForegroundColor Yellow
    $choice = Read-Host "`n使用现有密钥？(Y/N，默认Y)"
    if ($choice -ne "N" -and $choice -ne "n") {
        Write-Host "`n✓ 使用现有密钥" -ForegroundColor Green
        Write-Host "`n请将上面的公钥添加到 GitHub/GitLab/Gitee" -ForegroundColor Yellow
        exit 0
    }
}

# 获取邮箱
Write-Host "`n请输入你的邮箱地址（用于标识密钥）：" -ForegroundColor Yellow
$email = Read-Host "邮箱"
if ([string]::IsNullOrWhiteSpace($email)) {
    Write-Host "错误: 邮箱不能为空" -ForegroundColor Red
    exit 1
}

# 生成密钥
Write-Host "`n正在生成 SSH 密钥..." -ForegroundColor Yellow
Write-Host "提示: 可以设置密码保护密钥，或直接回车跳过" -ForegroundColor Gray

ssh-keygen -t ed25519 -C $email -f $keyFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ SSH 密钥生成成功！" -ForegroundColor Green
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  你的公钥（请复制）" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    $pubKey = Get-Content "$keyFile.pub"
    Write-Host $pubKey -ForegroundColor Yellow
    Write-Host ""
    
    # 尝试复制到剪贴板
    try {
        $pubKey | Set-Clipboard
        Write-Host "✓ 公钥已复制到剪贴板！" -ForegroundColor Green
    } catch {
        Write-Host "⚠ 请手动复制上面的公钥" -ForegroundColor Yellow
    }
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  添加到 Git 平台" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "`nGitHub: https://github.com/settings/ssh/new" -ForegroundColor Cyan
    Write-Host "GitLab: https://gitlab.com/-/profile/keys" -ForegroundColor Cyan
    Write-Host "Gitee:  https://gitee.com/profile/sshkeys" -ForegroundColor Cyan
    Write-Host "`n添加后按回车键测试连接..." -ForegroundColor Yellow
    Read-Host
    
    Write-Host "`n测试 GitHub 连接..." -ForegroundColor Yellow
    try {
        $sshResult = ssh -T git@github.com 2>&1
        $sshOutput = $sshResult -join "`n"
        
        if ($sshOutput -match "successfully authenticated") {
            Write-Host "✓ GitHub 连接成功！" -ForegroundColor Green
        }
        elseif ($sshOutput -match "Permission denied") {
            Write-Host "✗ 连接失败，请确认已添加公钥" -ForegroundColor Red
        }
        else {
            Write-Host $sshOutput -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "测试连接时出错: $_" -ForegroundColor Red
    }
    
    Write-Host "`n✓ 配置完成！现在可以使用 SSH 方式连接仓库了" -ForegroundColor Green
} else {
    Write-Host "`n✗ 密钥生成失败" -ForegroundColor Red
}

