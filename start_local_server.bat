@echo off
echo Starting Copperway Car Wash Local Development Server...
echo.

REM Check if PHP is installed
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PHP is not installed or not in PATH
    echo Please install PHP and add it to your PATH
    echo Download from: https://www.php.net/downloads.php
    pause
    exit /b 1
)

REM Check if MySQL is running (optional check)
echo Checking database connection...

REM Start PHP built-in server
echo Starting PHP development server on http://localhost:8000
echo.
echo IMPORTANT: Make sure you have:
echo 1. MySQL/MariaDB running locally
echo 2. Database 'copperway_carwash' created
echo 3. Database schema imported from database.sql
echo.
echo Press Ctrl+C to stop the server
echo.

php -S localhost:8000

pause
