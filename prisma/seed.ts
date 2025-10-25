import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Exterior Wash',
        description: 'Thorough exterior cleaning for a sparkling finish',
        price: 19.99,
        duration: 30,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Interior Detailing',
        description: 'Deep clean and vacuum for the inside of your vehicle',
        price: 24.99,
        duration: 45,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Wax & Polish',
        description: 'Protect your paint and add a lasting shine',
        price: 29.99,
        duration: 60,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Express Package',
        description: 'Quick wash and dry services for busy schedules',
        price: 15.99,
        duration: 20,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Premium Package',
        description: 'Basic + Wax & Polish + Complimentary Air Freshener',
        price: 34.99,
        duration: 75,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Elite Package',
        description: 'Premium + Deep Interior Clean + Headlight Restoration',
        price: 49.99,
        duration: 120,
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

  // Create business hours
  const businessHours = await Promise.all([
    prisma.businessHours.create({
      data: {
        dayOfWeek: 1, // Monday
        openTime: new Date('1970-01-01T08:00:00Z'),
        closeTime: new Date('1970-01-01T18:00:00Z'),
        isOpen: true,
      },
    }),
    prisma.businessHours.create({
      data: {
        dayOfWeek: 2, // Tuesday
        openTime: new Date('1970-01-01T08:00:00Z'),
        closeTime: new Date('1970-01-01T18:00:00Z'),
        isOpen: true,
      },
    }),
    prisma.businessHours.create({
      data: {
        dayOfWeek: 3, // Wednesday
        openTime: new Date('1970-01-01T08:00:00Z'),
        closeTime: new Date('1970-01-01T18:00:00Z'),
        isOpen: true,
      },
    }),
    prisma.businessHours.create({
      data: {
        dayOfWeek: 4, // Thursday
        openTime: new Date('1970-01-01T08:00:00Z'),
        closeTime: new Date('1970-01-01T18:00:00Z'),
        isOpen: true,
      },
    }),
    prisma.businessHours.create({
      data: {
        dayOfWeek: 5, // Friday
        openTime: new Date('1970-01-01T08:00:00Z'),
        closeTime: new Date('1970-01-01T18:00:00Z'),
        isOpen: true,
      },
    }),
    prisma.businessHours.create({
      data: {
        dayOfWeek: 6, // Saturday
        openTime: new Date('1970-01-01T08:00:00Z'),
        closeTime: new Date('1970-01-01T18:00:00Z'),
        isOpen: true,
      },
    }),
    prisma.businessHours.create({
      data: {
        dayOfWeek: 0, // Sunday
        openTime: new Date('1970-01-01T08:00:00Z'),
        closeTime: new Date('1970-01-01T18:00:00Z'),
        isOpen: false,
      },
    }),
  ]);

  console.log('✅ Business hours created:', businessHours.length);

  // Create location settings
  const location = await prisma.locationSettings.create({
    data: {
      name: 'Copperway Car Wash',
      address: 'Kitwe, Zambia',
      latitude: -12.8153,
      longitude: 28.2139,
      phone: '+260 123 456789',
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
