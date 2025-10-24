@echo off
echo ========================================
echo Copperway Car Wash - Database Setup
echo ========================================
echo.
echo This script will help you set up the database.
echo.
echo Step 1: Make sure MySQL is running
echo Step 2: Enter your MySQL root password when prompted
echo.
pause

echo.
echo Creating database...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS copperway_carwash CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo.
echo Importing database schema...
mysql -u root -p copperway_carwash < database.sql

echo.
echo ========================================
echo Database setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit config.php and update database credentials
echo 2. Create uploads directory: mkdir uploads\payment_screenshots
echo 3. Refresh your browser
echo.
pause

