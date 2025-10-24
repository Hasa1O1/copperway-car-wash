@echo off
echo ========================================
echo Copperway Car Wash - XAMPP Setup
echo ========================================
echo.

REM Check if XAMPP exists
if not exist "C:\xampp" (
    echo ERROR: XAMPP not found at C:\xampp
    echo Please install XAMPP first
    pause
    exit /b 1
)

echo Step 1: Copying project files to XAMPP htdocs...
echo.

REM Create project directory in htdocs
if not exist "C:\xampp\htdocs\copperway-carwash" (
    mkdir "C:\xampp\htdocs\copperway-carwash"
    echo Created directory: C:\xampp\htdocs\copperway-carwash
)

REM Copy all files
echo Copying files...
xcopy /E /I /Y "%~dp0*" "C:\xampp\htdocs\copperway-carwash\" /EXCLUDE:%~dp0setup_xampp.bat

echo.
echo Step 2: Starting XAMPP services...
echo.

REM Start Apache
echo Starting Apache...
start "" "C:\xampp\apache_start.bat"

REM Start MySQL
echo Starting MySQL...
start "" "C:\xampp\mysql_start.bat"

echo.
echo Step 3: Setting up database...
echo.
echo Please follow these steps:
echo 1. Wait for Apache and MySQL to start
echo 2. Open http://localhost/phpmyadmin in your browser
echo 3. Create a new database called 'copperway_carwash'
echo 4. Import the database.sql file
echo 5. Update config.php with database credentials
echo.

echo Copying database.sql to htdocs for easy access...
copy "%~dp0database.sql" "C:\xampp\htdocs\copperway-carwash\database.sql" >nul

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your application is now at:
echo http://localhost/copperway-carwash/
echo.
echo Next steps:
echo 1. Open http://localhost/phpmyadmin
echo 2. Create database 'copperway_carwash'
echo 3. Import database.sql
echo 4. Open http://localhost/copperway-carwash/
echo.
pause
