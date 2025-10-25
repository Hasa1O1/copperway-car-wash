# Supabase Project Setup Guide

## Step-by-Step: Creating a New Project on Supabase

### Step 1: Sign Up for Supabase
1. **Go to Supabase Website**
   - Open your browser and go to https://supabase.com
   - Click the **"Start your project"** button (top right)

2. **Create Account**
   - Click **"Sign up"**
   - Choose your preferred method:
     - **GitHub** (recommended - easier integration)
     - **Email** (traditional signup)
   - Complete the signup process

### Step 2: Create New Project
1. **Access Dashboard**
   - After signing up, you'll be redirected to the Supabase dashboard
   - Click **"New Project"** button

2. **Project Configuration**
   - **Organization**: Select your organization (or create one)
   - **Project Name**: Enter `copperway-car-wash`
   - **Database Password**: Create a strong password (save this!)
     - Example: `Copperway2025!SecurePass`
   - **Region**: Choose the closest region to your users
     - For Zambia: Choose **Europe** or **Asia Pacific**

3. **Create Project**
   - Click **"Create new project"**
   - Wait 2-3 minutes for the project to be set up

### Step 3: Get Database Connection String
1. **Navigate to Settings**
   - In your project dashboard, click **"Settings"** (gear icon) in the left sidebar
   - Click **"Database"** from the settings menu

2. **Find Connection String**
   - Scroll down to **"Connection string"** section
   - You'll see different connection string formats
   - Copy the **"URI"** format (it starts with `postgresql://`)

3. **Connection String Format**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
   - Replace `[YOUR-PASSWORD]` with the password you created
   - Replace `[PROJECT-REF]` with your project reference

### Step 4: Update Your Environment File
1. **Open .env.local**
   ```bash
   # In your project root directory
   code .env.local
   # or use any text editor
   ```

2. **Update DATABASE_URL**
   ```env
   # Replace with your actual Supabase connection string
   DATABASE_URL="postgresql://postgres:Copperway2025!SecurePass@db.abcdefghijklmnop.supabase.co:5432/postgres"
   ```

### Step 5: Test Database Connection
1. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

2. **Push Schema to Database**
   ```bash
   npm run db:push
   ```

3. **Seed Database**
   ```bash
   npm run db:seed
   ```

### Step 6: Verify Setup
1. **Check Supabase Dashboard**
   - Go back to your Supabase project
   - Click **"Table Editor"** in the left sidebar
   - You should see your tables: `services`, `bookings`, `admin_users`, etc.

2. **Test Your Application**
   ```bash
   npm run dev
   ```
   - Visit `http://localhost:3000`
   - Check if services load on the homepage
   - Try the admin login at `http://localhost:3000/admin/login`

## 🔧 Additional Supabase Configuration

### Enable Row Level Security (Optional)
1. **Go to Authentication**
   - Click **"Authentication"** in the left sidebar
   - Click **"Policies"** tab

2. **Create Policies** (if needed)
   - This is optional for basic setup
   - Can be configured later for enhanced security

### Set Up API Keys (For Future Features)
1. **Go to Settings → API**
   - Copy your **Project URL**
   - Copy your **anon public** key
   - These can be used for client-side operations later

## 🚨 Important Notes

### Security
- **Never commit your .env.local file** to version control
- **Keep your database password secure**
- **Use environment variables in production**

### Free Tier Limits
- **Database size**: 500MB
- **Bandwidth**: 2GB/month
- **Concurrent connections**: 60
- **API requests**: 50,000/month

### Backup
- Supabase automatically backs up your database
- You can create manual backups from the dashboard

## 🆘 Troubleshooting

### Connection Issues
- **Check password**: Make sure you're using the correct password
- **Check connection string**: Ensure the URL format is correct
- **Check project status**: Make sure your project is fully provisioned

### Common Errors
- **"Database does not exist"**: Wait a few more minutes for project setup
- **"Authentication failed"**: Double-check your password
- **"Connection timeout"**: Check your internet connection

### Getting Help
- **Supabase Docs**: https://supabase.com/docs
- **Community**: https://github.com/supabase/supabase/discussions
- **Discord**: https://discord.supabase.com

## ✅ Success Checklist

- [ ] Supabase account created
- [ ] New project created
- [ ] Database password saved securely
- [ ] Connection string copied
- [ ] .env.local file updated
- [ ] Prisma client generated
- [ ] Database schema pushed
- [ ] Database seeded with initial data
- [ ] Application tested locally

Once you complete these steps, your database will be ready and your application should work perfectly!
