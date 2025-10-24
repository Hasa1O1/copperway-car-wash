# Alternative: Use PlanetScale (Free MySQL)

If you prefer to stick with MySQL instead of PostgreSQL, here's how to use PlanetScale:

## Step 1: Create PlanetScale Account
1. Go to https://planetscale.com
2. Click "Sign up" and create free account
3. Connect with GitHub

## Step 2: Create Database
1. Click "Create database"
2. Choose "Free" plan
3. Name: `copperway-carwash`
4. Region: Choose closest to you
5. Click "Create database"

## Step 3: Import Schema
1. In PlanetScale dashboard, click "Connect"
2. Choose "General" connection method
3. Copy the connection string
4. Use MySQL client to import database.sql:
   ```bash
   mysql -h [host] -u [user] -p [database] < database.sql
   ```

## Step 4: Update Render Environment Variables
Use PlanetScale credentials instead of Render PostgreSQL:
- DB_HOST: [from PlanetScale connection string]
- DB_NAME: copperway_carwash
- DB_USER: [from PlanetScale]
- DB_PASS: [from PlanetScale]

## Step 5: Update config.php
Use the same environment variable approach:
```php
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'copperway_carwash');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
```

## Benefits of PlanetScale
- ✅ MySQL compatible (no conversion needed)
- ✅ Free tier available
- ✅ Better for your existing schema
- ✅ Branching support
- ✅ Auto-scaling

## Recommended Setup
- **Database**: PlanetScale (MySQL)
- **Web Hosting**: Render (PHP)
- **File Storage**: Cloudinary (for payment screenshots)

