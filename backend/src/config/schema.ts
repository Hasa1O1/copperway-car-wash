import { pool } from './database';

export async function createTables() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Services table
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        duration INT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Admin users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        role VARCHAR(20) DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'customer_service')),
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        booking_number VARCHAR(20) UNIQUE NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_email VARCHAR(100),
        vehicle_model VARCHAR(100) NOT NULL,
        vehicle_number_plate VARCHAR(20) NOT NULL,
        service_id INT NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
        scheduled_date DATE NOT NULL,
        scheduled_time TIME NOT NULL,
        pickup_required BOOLEAN DEFAULT FALSE,
        pickup_address TEXT,
        pickup_latitude DECIMAL(10, 8),
        pickup_longitude DECIMAL(11, 8),
        dropoff_address TEXT,
        dropoff_latitude DECIMAL(10, 8),
        dropoff_longitude DECIMAL(11, 8),
        status VARCHAR(20) DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'payment_verified', 'confirmed', 'in_queue', 'in_progress', 'completed', 'cancelled')),
        amount DECIMAL(10, 2) NOT NULL,
        payment_confirmed BOOLEAN DEFAULT FALSE,
        payment_method VARCHAR(50),
        payment_screenshot VARCHAR(255),
        payment_notes TEXT,
        slot_number INT,
        estimated_completion_time TIMESTAMP,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Queue history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS queue_history (
        id SERIAL PRIMARY KEY,
        booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        status_change VARCHAR(20) NOT NULL,
        changed_by INT REFERENCES admin_users(id) ON DELETE SET NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Business hours table
    await client.query(`
      CREATE TABLE IF NOT EXISTS business_hours (
        id SERIAL PRIMARY KEY,
        day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
        open_time TIME NOT NULL,
        close_time TIME NOT NULL,
        is_open BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Location settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS location_settings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        phone VARCHAR(100),
        email VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_booking_number ON bookings(booking_number);
      CREATE INDEX IF NOT EXISTS idx_booking_status ON bookings(status);
      CREATE INDEX IF NOT EXISTS idx_booking_date ON bookings(scheduled_date);
      CREATE INDEX IF NOT EXISTS idx_customer_phone ON bookings(customer_phone);
      CREATE INDEX IF NOT EXISTS idx_created_at ON bookings(created_at);
      CREATE INDEX IF NOT EXISTS idx_completed_at ON bookings(completed_at);
    `);

    // Create views for record keeping and reporting
    await client.query(`
      CREATE OR REPLACE VIEW customer_history AS
      SELECT 
        customer_name,
        customer_phone,
        customer_email,
        COUNT(*) as total_visits,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_visits,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_spent,
        MAX(created_at) as last_visit
      FROM bookings
      GROUP BY customer_name, customer_phone, customer_email
      ORDER BY last_visit DESC;
    `);

    await client.query(`
      CREATE OR REPLACE VIEW service_records AS
      SELECT 
        b.id,
        b.booking_number,
        b.customer_name,
        b.customer_phone,
        b.vehicle_model,
        b.vehicle_number_plate,
        s.name as service_name,
        b.amount,
        b.payment_method,
        b.completed_at as attended_at,
        b.created_at as booked_at,
        EXTRACT(EPOCH FROM (b.completed_at - b.created_at))/60 as booking_to_completion_minutes,
        CASE 
          WHEN b.pickup_required THEN 'Pickup Service'
          ELSE 'Drop-off'
        END as service_type
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.status = 'completed' AND b.completed_at IS NOT NULL
      ORDER BY b.completed_at DESC;
    `);

    await client.query(`
      CREATE OR REPLACE VIEW daily_stats AS
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_bookings,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as revenue,
        SUM(CASE WHEN pickup_required THEN 1 ELSE 0 END) as pickup_services,
        SUM(CASE WHEN status IN ('pending_payment', 'payment_verified', 'confirmed', 'in_queue', 'in_progress') THEN 1 ELSE 0 END) as active_bookings
      FROM bookings
      GROUP BY DATE(created_at)
      ORDER BY date DESC;
    `);

    // Insert default data if tables are empty
    const servicesCount = await client.query('SELECT COUNT(*) FROM services');
    if (parseInt(servicesCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO services (name, description, price, duration) VALUES
        ('Saloon Cars', 'Complete car wash, Pickup & delivery, Interior & exterior', 50.00, 60),
        ('SUVs (Hilux, etc.)', 'Complete car wash, Pickup & delivery, Larger vehicle service', 100.00, 90),
        ('Vans', 'Complete car wash, Pickup & delivery, Premium vehicle care', 70.00, 75),
        ('Carpets (per sqm)', 'Professional cleaning, Per square meter, Deep stain removal', 200.00, 120)
      `);
    }

    const adminCount = await client.query('SELECT COUNT(*) FROM admin_users');
    if (parseInt(adminCount.rows[0].count) === 0) {
      // Default password: admin123 (will be hashed in seed script)
      await client.query(`
        INSERT INTO admin_users (username, password, full_name, email, role) VALUES
        ('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin@copperwaywash.com', 'admin')
      `);
    }

    const businessHoursCount = await client.query('SELECT COUNT(*) FROM business_hours');
    if (parseInt(businessHoursCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO business_hours (day_of_week, open_time, close_time, is_open) VALUES
        (0, '07:00:00', '19:00:00', TRUE),
        (1, '07:00:00', '19:00:00', TRUE),
        (2, '07:00:00', '19:00:00', TRUE),
        (3, '07:00:00', '19:00:00', TRUE),
        (4, '07:00:00', '19:00:00', TRUE),
        (5, '07:00:00', '19:00:00', TRUE),
        (6, '07:00:00', '19:00:00', TRUE)
      `);
    }

    const locationCount = await client.query('SELECT COUNT(*) FROM location_settings');
    if (parseInt(locationCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO location_settings (name, address, latitude, longitude, phone, email) VALUES
        ('Copperway Car Wash', 'Kitwe, Zambia', -12.8153, 28.2139, '+260 123 456789', 'contact@copperwaywash.com')
      `);
    }

    await client.query('COMMIT');
    console.log('✅ Database tables created/verified');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

