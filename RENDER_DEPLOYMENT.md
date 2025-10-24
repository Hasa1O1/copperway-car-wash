# Render Deployment Guide for Copperway Car Wash

## Prerequisites
- GitHub account with your repository pushed
- Render account (sign up at https://render.com)

## Step-by-Step Deployment

### 1. Create Database on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"** (or MySQL if available)
3. Configure:
   - **Name**: `copperway-db`
   - **Database**: `copperway_carwash`
   - **User**: `copperway_user`
   - **Plan**: Free
4. Click **"Create Database"**
5. Wait for database to be provisioned
6. Copy the **Internal Database URL** (you'll need this)

### 2. Deploy Web Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Hasa1O1/copperway-car-wash`
3. Configure the service:
   - **Name**: `copperway-car-wash`
   - **Environment**: `PHP`
   - **Build Command**: Leave empty
   - **Start Command**: `php -S 0.0.0.0:$PORT`
   - **Plan**: Free

### 3. Set Environment Variables

In your web service settings, add these environment variables:

```
DB_HOST=<your-database-host>
DB_NAME=copperway_carwash
DB_USER=<your-database-user>
DB_PASS=<your-database-password>
```

**To get these values:**
- Go to your database dashboard
- Copy the values from the connection string
- Example: `mysql://user:password@hostname:port/database`

### 4. Update Config File

After deployment, you need to update `config.php` to use environment variables:

```php
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'copperway_carwash');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
```

Or use the provided `config.render.php` file.

### 5. Import Database Schema

1. Go to your database dashboard on Render
2. Click **"Connect"** → **"External Connection"**
3. Use a MySQL client (like MySQL Workbench or phpMyAdmin) to connect
4. Import the `database.sql` file

**Alternative - Using Render Shell:**
```bash
# Connect to Render shell
render shell

# Import database
mysql -h <host> -u <user> -p <database> < database.sql
```

### 6. Set Up File Uploads

The `uploads` directory needs write permissions. Render handles this automatically, but ensure:
- Directory exists: `uploads/payment_screenshots/`
- Permissions are set correctly

### 7. Access Your Application

Once deployed, your app will be available at:
`https://copperway-car-wash.onrender.com`

## Important Notes

### Database Connection
- Render provides PostgreSQL by default
- If you need MySQL, consider using a managed MySQL service or adapt the code for PostgreSQL

### File Storage
- Render's file system is ephemeral (files are lost on restart)
- For production, consider using cloud storage (AWS S3, Cloudinary) for uploaded files

### Environment Variables
- Never commit sensitive data to git
- Use Render's environment variables for all secrets
- Update `.gitignore` to exclude `config.php`

### Custom Domain
1. Go to your service settings
2. Click **"Custom Domains"**
3. Add your domain
4. Update DNS records as instructed

## Troubleshooting

### Database Connection Error
- Verify environment variables are set correctly
- Check database is running
- Ensure database name matches

### File Upload Not Working
- Check directory permissions
- Verify `uploads` directory exists
- Check PHP upload settings

### 404 Errors
- Ensure `.htaccess` is in the root directory
- Check that `index.html` exists
- Verify file paths are correct

## PostgreSQL Migration (if needed)

If using PostgreSQL instead of MySQL, you'll need to:
1. Convert SQL syntax (e.g., `AUTO_INCREMENT` → `SERIAL`)
2. Update PDO connection string
3. Adjust data types if needed

## Support

For issues:
- Render Docs: https://render.com/docs
- Render Community: https://community.render.com

