import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a sample group
  const group = await prisma.group.create({
    data: {
      name: 'Sample Household',
      joinCode: 'SAMPLE',
    },
  });

  console.log('✅ Created sample group:', group);

  // Create sample chores
  const chores = await Promise.all([
    prisma.chore.create({
      data: {
        title: 'Take out trash',
        frequency: 'weekly',
        assignmentType: 'single',
        groupId: group.id,
      },
    }),
    prisma.chore.create({
      data: {
        title: 'Vacuum living room',
        frequency: 'weekly',
        assignmentType: 'alternating',
        groupId: group.id,
      },
    }),
    prisma.chore.create({
      data: {
        title: 'Wash dishes',
        frequency: 'daily',
        assignmentType: 'alternating',
        groupId: group.id,
      },
    }),
    prisma.chore.create({
      data: {
        title: 'Clean bathroom',
        frequency: 'weekly',
        assignmentType: 'alternating',
        groupId: group.id,
      },
    }),
    prisma.chore.create({
      data: {
        title: 'Mow lawn',
        frequency: 'custom',
        customInterval: 14,
        assignmentType: 'single',
        groupId: group.id,
      },
    }),
  ]);

  console.log('✅ Created sample chores:', chores);

  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('📝 Sample data created:');
  console.log(`   Group: ${group.name} (Join Code: ${group.joinCode})`);
  console.log(`   Chores: ${chores.length} sample chores`);
  console.log('');
  console.log('🚀 You can now start the development server with: npm run dev');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
