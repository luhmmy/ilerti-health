import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('🧹 Starting full clean wipe of registered users on Supabase PostgreSQL database...');

  await prisma.consultation.deleteMany({});
  await prisma.healthRecord.deleteMany({});
  await prisma.wellnessPlan.deleteMany({});
  await prisma.healthProfile.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.aiConversation.deleteMany({});
  
  // Wipe all registered users for a completely fresh start
  const deletedUsers = await prisma.user.deleteMany({});

  console.log(`✅ Successfully wiped ${deletedUsers.count} registered user accounts.`);
  console.log('🚀 Database is now 100% fresh and ready for new live signups!');
}

cleanDatabase()
  .catch((err) => {
    console.error('Error cleaning database:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
