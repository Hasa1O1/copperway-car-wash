# Database Setup Guide

## Step 2: Database Setup Options

You have several options for setting up your PostgreSQL database. Choose the one that best fits your needs:

## Option A: Local PostgreSQL Installation

### Windows (Using PostgreSQL Installer)
1. **Download PostgreSQL**
   - Go to https://www.postgresql.org/download/windows/
   - Download the latest version installer

2. **Install PostgreSQL**
   - Run the installer as administrator
   - Choose installation directory (default is fine)
   - Set password for 'postgres' user (remember this!)
   - Keep default port 5432
   - Complete installation

3. **Create Database**
   ```bash
   # Open Command Prompt or PowerShell
   psql -U postgres
   # Enter your password when prompted
   
   # Create database
   CREATE DATABASE copperway_carwash;
   
   # Exit psql
   \q
   ```

4. **Update Environment Variables**
   ```bash
   # Copy the example file
   cp env.example .env.local
   ```
   
   Edit `.env.local` and update:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/copperway_carwash"
   ```

### macOS (Using Homebrew)
```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create database
createdb copperway_carwash

# Update .env.local
DATABASE_URL="postgresql://$(whoami)@localhost:5432/copperway_carwash"
```

### Linux (Ubuntu/Debian)
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE copperway_carwash;

# Create user (optional)
CREATE USER copperway_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE copperway_carwash TO copperway_user;

# Exit
\q
```

## Option B: Cloud Database (Recommended for Production)

### Supabase (Free Tier Available)
1. **Sign Up**
   - Go to https://supabase.com
   - Create account and new project

2. **Get Connection String**
   - Go to Settings → Database
   - Copy the connection string
   - Format: `postgresql://postgres:[password]@[host]:5432/postgres`

3. **Update .env.local**
   ```env
   DATABASE_URL="your-supabase-connection-string"
   ```

### PlanetScale (MySQL Compatible)
1. **Sign Up**
   - Go to https://planetscale.com
   - Create account and database

2. **Get Connection String**
   - Copy the connection string from dashboard
   - Format: `mysql://[username]:[password]@[host]/[database]`

3. **Update Prisma Schema**
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```

### Neon (PostgreSQL)
1. **Sign Up**
   - Go to https://neon.tech
   - Create account and project

2. **Get Connection String**
   - Copy from dashboard
   - Format: `postgresql://[username]:[password]@[host]/[database]`

### Railway
1. **Sign Up**
   - Go to https://railway.app
   - Create account

2. **Create PostgreSQL Service**
   - Click "New Project"
   - Add PostgreSQL database
   - Copy connection string

## Option C: Docker (Local Development)

### Using Docker Compose
1. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: copperway_carwash
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: password
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

2. **Start Database**
   ```bash
   docker-compose up -d
   ```

3. **Update .env.local**
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/copperway_carwash"
   ```

## Step 3: Initialize Database Schema

After setting up your database, run these commands:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with initial data
npm run db:seed
```

## Troubleshooting

### Connection Issues
- **Check if PostgreSQL is running**: `pg_ctl status` (Windows) or `brew services list` (macOS)
- **Verify connection string format**: Must include username, password, host, port, and database name
- **Check firewall settings**: Ensure port 5432 is not blocked

### Permission Issues
- **Windows**: Run Command Prompt as Administrator
- **macOS/Linux**: Ensure user has proper permissions

### Environment Variables
- Make sure `.env.local` is in the root directory
- Restart your development server after changing environment variables
- Check for typos in the DATABASE_URL

## Next Steps

Once your database is set up and initialized:

1. **Test Connection**: Run `npm run dev` and check if the app loads
2. **Verify Data**: Check if services are loaded on the homepage
3. **Test Admin Login**: Try logging in with admin/admin123

## Need Help?

If you encounter issues:
1. Check the console for error messages
2. Verify your DATABASE_URL format
3. Ensure PostgreSQL is running
4. Check the Prisma documentation: https://www.prisma.io/docs
