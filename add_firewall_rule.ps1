# 添加防火墙规则 - 自动请求管理员权限
$ruleName = "Resume HTTP 80"
$ruleExists = (netsh.exe advfirewall firewall show rule name="$ruleName" 2>$null) -match "规则名称"

if (-not $ruleExists) {
    netsh.exe advfirewall firewall add rule name="$ruleName" dir=in action=allow protocol=TCP localport=80
    Write-Host "✅ 防火墙规则已添加" -ForegroundColor Green
} else {
    Write-Host "ℹ️ 防火墙规则已存在" -ForegroundColor Yellow
}

# 保持窗口打开
Read-Host "按 Enter 退出"