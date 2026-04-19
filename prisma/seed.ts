import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { categoryBlueprint } from "../src/data/category-blueprint";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Syncing categories...");

  for (const mainCategory of categoryBlueprint) {
    const main = await prisma.mainCategory.upsert({
      where: { slug: mainCategory.slug },
      update: {
        name: mainCategory.name,
      },
      create: {
        name: mainCategory.name,
        slug: mainCategory.slug,
      },
    });

    for (const sub of mainCategory.subcategories) {
      await prisma.subCategory.upsert({
        where: { slug: sub.slug },
        update: {
          name: sub.name,
          mainCategoryId: main.id,
        },
        create: {
          name: sub.name,
          slug: sub.slug,
          mainCategoryId: main.id,
        },
      });
    }
  }

  console.log("✅ Categories synced");

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@equilibrium.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: "ADMIN",
      fullName: "Администратор",
    },
    create: {
      email: adminEmail,
      passwordHash,
      fullName: "Администратор",
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user: ${adminEmail} (set ADMIN_PASSWORD in .env for production)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
