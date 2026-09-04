import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Clear existing data
  await prisma.user.deleteMany({});
  
  // 2. Seed basic user
  const user = await prisma.user.create({
    data: {
      email: 'patient@ilerti.com',
      firstName: 'Test',
      lastName: 'Patient',
      passwordHash: '$2a$10$wN314o5L2n4BqZ7.mYkKDe1XgY4dE2fF1.rK6rO6kP9aC8hW0jR4a',
      role: 'PATIENT',
    },
  });

  console.log(`Created test user with id: ${user.id}`);
  
  // Note: Actual doctors and facilities can be seeded here if they are part of the DB schema.
  // Currently, they are stored in static TypeScript files as requested for the UI.
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
