@echo off
chcp 65001 >nul
echo ==========================================
echo HAPI Hub with Feishu Integration
echo ==========================================
echo.

REM Set Feishu credentials
set FEISHU_APP_ID=cli_a933a4feadb81cc9
set FEISHU_APP_SECRET=e7ScIG1itQdnQPPT4KFsZfsWxrKSXhAT
set FEISHU_VERIFICATION_TOKEN=4bcHA2FSS93WLDsKrOmKDgZ3RrV26oS0
set FEISHU_ENABLED=true
set FEISHU_NOTIFICATION=true
set FEISHU_BASE_URL=https://open.feishu.cn

echo Configuration:
echo   App ID: %FEISHU_APP_ID:~0,10%...
echo   Enabled: %FEISHU_ENABLED%
echo.

REM Add bun to PATH
set PATH=%USERPROFILE%\.bun\bin;%PATH%

REM Check bun
call bun --version >nul 2>&1
if errorlevel 1 (
    echo Error: Bun not found
    exit /b 1
)

echo Starting HAPI Hub...
echo Press Ctrl+C to stop
echo.

REM Run hub
cd /d "%~dp0\hub"
call bun run start
