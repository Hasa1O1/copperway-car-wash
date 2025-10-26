import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create services based on advertisement
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Saloon Cars',
        description: 'Complete car wash service for saloon cars with pickup & delivery',
        price: 50.00,
        duration: 45,
      },
    }),
    prisma.service.create({
      data: {
        name: 'SUVs (Hilux, etc.)',
        description: 'Complete car wash service for SUVs and pickup trucks with pickup & delivery',
        price: 100.00,
        duration: 60,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Vans',
        description: 'Complete car wash service for vans with pickup & delivery',
        price: 70.00,
        duration: 50,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Carpets (per sqm)',
        description: 'Professional carpet cleaning service per square meter',
        price: 200.00,
        duration: 30,
      },
    }),
  ]);

  console.log('✅ Services created:', services.length);

  // Create admin users
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUsers = await Promise.all([
    prisma.adminUser.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        fullName: 'Administrator',
        email: 'admin@copperwaywash.com',
        role: 'ADMIN',
      },
    }),
    prisma.adminUser.create({
      data: {
        username: 'staff1',
        password: hashedPassword,
        fullName: 'Customer Service Staff',
        email: 'staff@copperwaywash.com',
        role: 'CUSTOMER_SERVICE',
      },
    }),
  ]);

  console.log('✅ Admin users created:', adminUsers.length);

  // Create business hours (All 7 Days: 07:00 - 19:00)
  const businessHours = await Promise.all([
    prisma.businessHours.create({
      data: {
        dayOfWeek: 0, // Sunday
        openTime: new Date('1970-01-01T07:00:00Z'),
        closeTime: new Date('1970-01-01T19:00:00Z'),
        isOpen: true,
      },
    }),
    prisma.businessHours.create({
      data: {
        dayOfWeek: 1, // Monday
        openTime: new Date('1970-01-01T07:00:00Z'),
        closeTime: new Date('1970-01-01T19:00:00Z'),
        isOpen: true,
      },
    }),
    prisma.businessHours.create({
      data: {
        dayOfWeek: 2, // Tuesday
        openTime: new Date('1970-01-01T07:00:00Z'),
        closeTime: new Date('1970-01-01T19:00:00Z'),
        isOpen: true,
      },
    }),
    prisma.businessHours.create({
      data: {
        dayOfWeek: 3, // Wednesday
        openTime: new Date('1970-01-01T07:00:00Z'),
        closeTime: new Date('1970-01-01T19:00:00Z'),
        isOpen: true,
      },
    }),
    prisma.businessHours.create({
      data: {
        dayOfWeek: 4, // Thursday
        openTime: new Date('1970-01-01T07:00:00Z'),
        closeTime: new Date('1970-01-01T19:00:00Z'),
        isOpen: true,
      },
    }),
    prisma.businessHours.create({
      data: {
        dayOfWeek: 5, // Friday
        openTime: new Date('1970-01-01T07:00:00Z'),
        closeTime: new Date('1970-01-01T19:00:00Z'),
        isOpen: true,
      },
    }),
    prisma.businessHours.create({
      data: {
        dayOfWeek: 6, // Saturday
        openTime: new Date('1970-01-01T07:00:00Z'),
        closeTime: new Date('1970-01-01T19:00:00Z'),
        isOpen: true,
      },
    }),
  ]);

  console.log('✅ Business hours created:', businessHours.length);

  // Create location settings
  const location = await prisma.locationSettings.create({
    data: {
      name: 'Copperway Car Wash',
      address: 'Chalala Selena Area (Opposite White Shop), Lusaka, Zambia',
      latitude: -15.4167,
      longitude: 28.2833,
      phone: '0974323234',
      email: 'contact@copperwaywash.com',
    },
  });

  console.log('✅ Location settings created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
