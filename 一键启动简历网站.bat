@echo off
title 邓凤仪简历 - 一键启动
color 0A
echo ====================================
echo  邓凤仪个人简历 - 一键启动器
echo ====================================
echo.

:: 设置Node.js环境
set PATH=C:\Program Files\nodejs;%PATH%

:: 先启动本地服务器
echo [1/2] 启动本地网页服务器...
start "Resume-Server" /MIN cmd /c "npx http-server -p 80 --cors"
echo   等待服务器启动...
timeout /t 3 /nobreak >nul
echo   ✅ 本地服务器已启动！

:: 启动公网隧道
echo.
echo [2/2] 创建公网访问隧道...
echo   正在连接...
echo.
start "Resume-Tunnel" /MIN cmd /c "npx localtunnel --port 80"
timeout /t 8 /nobreak >nul
echo   ✅ 公网隧道创建成功！
echo.
echo ====================================
echo  你的简历已经上线！
echo  本地访问: http://localhost:80
echo.
echo  公网访问链接在 Tunnel 窗口里
echo  (以 https://xxx.loca.lt 开头)
echo ====================================
echo.
echo  ⚠️ 首次访问公网链接时，需要
echo  点击页面上的"Click to Continue"按钮
echo.
pause