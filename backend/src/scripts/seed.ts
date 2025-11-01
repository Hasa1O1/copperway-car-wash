import bcrypt from 'bcrypt';
import { pool } from '../config/database';

async function seed() {
  try {
    // Seed admin user with hashed password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE admin_users SET password = $1 WHERE username = 'admin'`,
      [hashedPassword]
    );

    console.log('✅ Admin password seeded (username: admin, password: admin123)');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await pool.end();
  }
}

seed();

