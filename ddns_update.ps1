# 邓凤仪简历 - DDNS 自动更新脚本
# 自动检测公网IP变化并更新DNSHE域名解析

$API_BASE = "https://api005.dnshe.com/index.php?m=domain_hub"
$DOMAIN = "0115wisp.cc.cd"

# 配置你的 DNSHE API 凭证（请填写你自己的 Key 和 Secret）
$API_KEY = "在这里填你的API_Key"
$API_SECRET = "在这里填你的API_Secret"

$CURRENT_IP_FILE = "$PSScriptRoot\current_ip.txt"

# 获取当前公网IP
try {
    $publicIp = (Invoke-RestMethod -Uri "https://api.ipify.org?format=json" -ErrorAction Stop).ip
} catch {
    Write-Host "❌ 无法获取公网IP" -ForegroundColor Red
    exit 1
}

Write-Host "当前公网IP: $publicIp" -ForegroundColor Cyan

# 读取上次记录的IP
$lastIp = ""
if (Test-Path $CURRENT_IP_FILE) {
    $lastIp = Get-Content $CURRENT_IP_FILE -Raw -ErrorAction SilentlyContinue
}

# 如果IP没变，无需更新
if ($lastIp -eq $publicIp) {
    Write-Host "ℹ️ IP无变化，无需更新" -ForegroundColor Yellow
    exit 0
}

Write-Host "🔄 IP已变化，正在更新DNS记录..." -ForegroundColor Yellow

# 注意：以下API调用需要你先在DNSHE后台创建API密钥并填到上面
# 获取域名信息
$headers = @{
    "X-API-Key" = $API_KEY
    "X-API-Secret" = $API_SECRET
    "Content-Type" = "application/json"
}

# 先查询现有DNS记录
try {
    $listUrl = "$API_BASE&endpoint=subdomains&action=list&search=$DOMAIN"
    $subdomainResult = Invoke-RestMethod -Uri $listUrl -Headers $headers -Method Get -ErrorAction SilentlyContinue
    
    if ($subdomainResult.success -and $subdomainResult.subdomains.Count -gt 0) {
        $subdomainId = $subdomainResult.subdomains[0].id
        
        # 获取DNS记录列表
        $dnsUrl = "$API_BASE&endpoint=dns_records&action=list&subdomain_id=$subdomainId"
        $dnsResult = Invoke-RestMethod -Uri $dnsUrl -Headers $headers -Method Get -ErrorAction SilentlyContinue
        
        $aRecordUpdated = $false
        if ($dnsResult.success -and $dnsResult.records.Count -gt 0) {
            foreach ($record in $dnsResult.records) {
                if ($record.type -eq "A") {
                    # 更新现有的A记录
                    $updateBody = @{
                        "id" = $record.id
                        "type" = "A"
                        "content" = $publicIp
                        "ttl" = 600
                    } | ConvertTo-Json
                    
                    $updateUrl = "$API_BASE&endpoint=dns_records&action=update"
                    $updateResult = Invoke-RestMethod -Uri $updateUrl -Headers $headers -Method Post -Body $updateBody -ErrorAction SilentlyContinue
                    
                    if ($updateResult.success) {
                        Write-Host "✅ A记录已更新: $publicIp" -ForegroundColor Green
                        $aRecordUpdated = $true
                    }
                    break
                }
            }
        }
        
        if (-not $aRecordUpdated) {
            # 没有A记录，创建新的
            $createBody = @{
                "subdomain_id" = $subdomainId
                "type" = "A"
                "content" = $publicIp
                "ttl" = 600
            } | ConvertTo-Json
            
            $createUrl = "$API_BASE&endpoint=dns_records&action=create"
            $createResult = Invoke-RestMethod -Uri $createUrl -Headers $headers -Method Post -Body $createBody -ErrorAction SilentlyContinue
            
            if ($createResult.success) {
                Write-Host "✅ A记录已创建: $publicIp" -ForegroundColor Green
                $aRecordUpdated = $true
            }
        }
        
        if ($aRecordUpdated) {
            $publicIp | Out-File $CURRENT_IP_FILE -Force
            Write-Host "✅ IP已保存" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠️ 未找到域名 $DOMAIN，请确认API凭证正确" -ForegroundColor Yellow
        Write-Host "   请登录 https://my.dnshe.com → API管理 → 创建API密钥" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ API调用失败：$_" -ForegroundColor Red
    Write-Host "   请确认API Key和Secret已正确填写" -ForegroundColor Yellow
}