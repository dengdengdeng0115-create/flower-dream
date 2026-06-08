@echo off
title 邓凤仪简历网页 - 自动启动器
echo ====================================
echo  邓凤仪个人简历 - 服务启动器
echo ====================================
echo.

:: 添加防火墙规则（需要管理员权限）
echo [1/3] 添加防火墙规则...
netsh advfirewall firewall add rule name="Resume HTTP 80" dir=in action=allow protocol=TCP localport=80 >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✅ 防火墙规则已添加
) else (
    echo   ⚠️ 请右键选择"以管理员身份运行"来添加防火墙规则
)

:: 设置Node.js环境变量
set PATH=C:\Program Files\nodejs;%PATH%

:: 启动网页服务器
echo [2/3] 启动网页服务器（端口80）...
echo.
start "Resume Server" /B npx http-server -p 80 --cros>"server_log.txt" 2>&1
echo   ✅ 服务器已启动！
echo.
echo [3/3] 完成！
echo.
echo ====================================
echo  访问地址：
echo  本地: http://localhost:80
echo  公网: http://你的公网IP:80
echo.
echo  如需外网访问，还需要：
echo  1. 在 DNSHE 添加 A 记录指向你的公网IP
echo  2. 路由器设置端口转发（端口80）
echo ====================================
echo.
pause