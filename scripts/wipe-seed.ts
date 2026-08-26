import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED_TWITTER_IDS = [
  "demo",
  ...Array.from({ length: 21 }, (_, i) => `t${i + 1}`),
];

async function main() {
  const users = await prisma.user.findMany({
    where: { twitterId: { in: SEED_TWITTER_IDS } },
    select: { id: true },
  });
  const userIds = users.map((u) => u.id);
  if (userIds.length === 0) {
    console.log("No seed users found — nothing to wipe.");
    return;
  }

  const apps = await prisma.app.findMany({
    where: { userId: { in: userIds } },
    select: { id: true },
  });
  const appIds = apps.map((a) => a.id);

  await prisma.payment.deleteMany({
    where: { OR: [{ userId: { in: userIds } }, { appId: { in: appIds } }] },
  });
  await prisma.notification.deleteMany({
    where: { userId: { in: userIds } },
  });
  await prisma.watchlist.deleteMany({
    where: { OR: [{ userId: { in: userIds } }, { appId: { in: appIds } }] },
  });
  await prisma.challenge.deleteMany({
    where: {
      OR: [{ challengerId: { in: userIds } }, { targetAppId: { in: appIds } }],
    },
  });
  await prisma.bid.deleteMany({
    where: { OR: [{ bidderUserId: { in: userIds } }, { appId: { in: appIds } }] },
  });
  await prisma.swipe.deleteMany({
    where: { OR: [{ voterUserId: { in: userIds } }, { appId: { in: appIds } }] },
  });
  await prisma.app.deleteMany({ where: { id: { in: appIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });

  console.log(`Wiped ${appIds.length} seed apps and ${userIds.length} seed users.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
