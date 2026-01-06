# Git 安装检查脚本

Write-Host ""
Write-Host "=== Git 安装检查 ===" -ForegroundColor Cyan
Write-Host ""

# 检查 Git 是否在 PATH 中
Write-Host "1. 检查 Git 是否在 PATH 中..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Git 已安装并可访问" -ForegroundColor Green
        Write-Host "  版本: $gitVersion" -ForegroundColor Gray
        exit 0
    }
}
catch {
    Write-Host "✗ Git 不在 PATH 中" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. 检查常见安装位置..." -ForegroundColor Yellow

$commonPaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\bin\git.exe",
    "$env:ProgramFiles\Git\bin\git.exe",
    "$env:ProgramFiles(x86)\Git\bin\git.exe"
)

$foundGit = $false
foreach ($path in $commonPaths) {
    if (Test-Path $path) {
        Write-Host "✓ 找到 Git: $path" -ForegroundColor Green
        $foundGit = $true
        
        # 获取版本信息
        $version = & $path --version
        Write-Host "  版本: $version" -ForegroundColor Gray
        
        # 检查是否在 PATH 中
        $gitDir = Split-Path $path -Parent
        if ($env:PATH -notlike "*$gitDir*") {
            Write-Host ""
            Write-Host "⚠ Git 已安装但未添加到 PATH" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "解决方案：" -ForegroundColor Cyan
            Write-Host "1. 临时添加（当前会话有效）：" -ForegroundColor White
            Write-Host "   `$env:PATH += `";$gitDir`"" -ForegroundColor Gray
            Write-Host ""
            Write-Host "2. 永久添加：" -ForegroundColor White
            Write-Host "   - 按 Win+R，输入 sysdm.cpl" -ForegroundColor Gray
            Write-Host "   - 高级 → 环境变量 → 系统变量 → Path → 编辑" -ForegroundColor Gray
            Write-Host "   - 添加: $gitDir" -ForegroundColor Gray
            Write-Host "   - 重新打开 PowerShell" -ForegroundColor Gray
            break
        }
    }
}

if (-not $foundGit) {
    Write-Host "✗ 未找到 Git 安装" -ForegroundColor Red
    Write-Host ""
    Write-Host "请安装 Git：" -ForegroundColor Yellow
    Write-Host "1. 访问: https://git-scm.com/download/win" -ForegroundColor Cyan
    Write-Host "2. 下载并安装 Git for Windows" -ForegroundColor White
    Write-Host "3. 安装时确保选择 '添加到 PATH'" -ForegroundColor White
    Write-Host "4. 重新打开 PowerShell" -ForegroundColor White
}

Write-Host ""
Write-Host "=== 检查完成 ===" -ForegroundColor Cyan
Write-Host ""

