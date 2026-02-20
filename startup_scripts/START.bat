@echo off
REM Wild Guard - Quick Start Script
REM Double-click this file to start all services

echo.
echo =============================================
echo     WILD GUARD - Quick Start
echo =============================================
echo.

cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\START_SERVICES.ps1"

pause
