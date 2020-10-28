const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.link.create({
    data: {
      description: 'Fullstack tutorial for GraphQL',
      url: 'www.howtographql.com',
    },
  });

  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

main().catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
