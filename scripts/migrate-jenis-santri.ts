import { PrismaClient } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting migration: syncing jenisSantri from Santri to User...");

  // Get all santri with their users
  const santriList = await prisma.santri.findMany({
    where: {
      userId: { not: null },
    },
    select: {
      id: true,
      jenisSantri: true,
      userId: true,
      nama: true,
    },
  });

  console.log(`Found ${santriList.length} santri with linked users`);

  // Update each user with their jenisSantri
  let updated = 0;
  for (const santri of santriList) {
    if (santri.userId) {
      await prisma.user.update({
        where: { id: santri.userId },
        data: { jenisSantri: santri.jenisSantri },
      });
      console.log(
        `Updated user ${santri.userId} (${santri.nama}) with jenisSantri: ${santri.jenisSantri}`
      );
      updated++;
    }
  }

  console.log(`Migration complete! Updated ${updated} users.`);
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });