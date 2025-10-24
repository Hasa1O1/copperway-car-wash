@echo off
echo Copperway Car Wash - Local Environment Setup
echo ==========================================
echo.

REM Check if XAMPP is installed
set XAMPP_PATH=
if exist "C:\xampp\php\php.exe" set XAMPP_PATH=C:\xampp
if exist "D:\xampp\php\php.exe" set XAMPP_PATH=D:\xampp
if exist "E:\xampp\php\php.exe" set XAMPP_PATH=E:\xampp

if not "%XAMPP_PATH%"=="" (
    echo Found XAMPP installation at: %XAMPP_PATH%
    echo.
    echo Starting XAMPP services...
    
    REM Start Apache and MySQL
    "%XAMPP_PATH%\apache\bin\httpd.exe" -k start
    "%XAMPP_PATH%\mysql\bin\mysqld.exe" --defaults-file="%XAMPP_PATH%\mysql\bin\my.ini" --standalone --console
    
    echo.
    echo XAMPP services started!
    echo - Apache: http://localhost:80
    echo - MySQL: localhost:3306
    echo - phpMyAdmin: http://localhost/phpmyadmin
    echo.
    echo Please copy your project files to: %XAMPP_PATH%\htdocs\copperway-carwash\
    echo Then access: http://localhost/copperway-carwash/
    echo.
) else (
    echo XAMPP not found. Please install XAMPP for easy setup:
    echo Download from: https://www.apachefriends.org/download.html
    echo.
    echo Alternative: Install PHP and MySQL separately
    echo.
)

echo Setting up database...
echo Please make sure to:
echo 1. Create database 'copperway_carwash'
echo 2. Import database.sql file
echo 3. Update config.php with correct database credentials
echo.

pause
