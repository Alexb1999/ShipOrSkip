import { PrismaClient, Prisma } from "@prisma/client";
import { DEFAULT_ELO } from "../lib/elo";

const prisma = new PrismaClient();

type SeedApp = {
  twitterId: string;
  username: string;
  name: string;
  avatarSeed: string;
  appName: string;
  tagline: string;
  websiteUrl: string;
  pitchVideoUrl?: string;
  techStack: string[];
  mrr: number;
  elo: number;
  verified?: boolean;
};

const SEED: SeedApp[] = [
  {
    twitterId: "demo",
    username: "demo_hacker",
    name: "Demo Hacker",
    avatarSeed: "demo",
    appName: "NoodleVault",
    tagline: "A password manager that only stores ramen shop Wi-Fi codes.",
    websiteUrl: "https://noodlevault.example",
    techStack: ["Next.js", "SQLite", "Hope"],
    mrr: 840,
    elo: 1280,
  },
  {
    twitterId: "t1",
    username: "frogstack",
    name: "Lily Pad",
    avatarSeed: "frog",
    appName: "FrogStack",
    tagline: "Notion for amphibians. Nobody asked.",
    websiteUrl: "https://frogstack.example",
    techStack: ["Svelte", "PocketBase"],
    mrr: 0,
    elo: 1620,
  },
  {
    twitterId: "t2",
    username: "waitlistos",
    name: "Queue Queen",
    avatarSeed: "wait",
    appName: "WaitlistOS",
    tagline: "A waitlist for your waitlist. Series A incoming.",
    websiteUrl: "https://waitlistos.example",
    techStack: ["Webflow", "Airtable"],
    mrr: 0,
    elo: 1710,
  },
  {
    twitterId: "t3",
    username: "pixelpension",
    name: "Retire.exe",
    avatarSeed: "pixel",
    appName: "PixelPension",
    tagline: "Retire in 400 years if you ship daily.",
    websiteUrl: "https://pixelpension.example",
    techStack: ["Phaser", "Supabase"],
    mrr: 0,
    elo: 1180,
  },
  {
    twitterId: "t4",
    username: "roastmysaas",
    name: "Burn Unit",
    avatarSeed: "roast",
    appName: "RoastMySaaS",
    tagline: "Pay founders to insult your landing page.",
    websiteUrl: "https://roastmysaas.example",
    techStack: ["Rails", "Stripe"],
    mrr: 420,
    elo: 1340,
  },
  {
    twitterId: "t5",
    username: "inboxjail",
    name: "CC'd Forever",
    avatarSeed: "inbox",
    appName: "InboxJail",
    tagline: "Puts your email in timeout until you ship.",
    websiteUrl: "https://inboxjail.example",
    techStack: ["Go", "Postgres"],
    mrr: 150,
    elo: 1090,
  },
  {
    twitterId: "t6",
    username: "calendarclash",
    name: "Busy Betty",
    avatarSeed: "cal",
    appName: "CalendarClash",
    tagline: "Battle royale for your 15-minute slots.",
    websiteUrl: "https://calendarclash.example",
    techStack: ["React", "Google Calendar"],
    mrr: 890,
    elo: 1210,
  },
  {
    twitterId: "t7",
    username: "shiplog",
    name: "Changelog Chad",
    avatarSeed: "ship",
    appName: "ShipLog",
    tagline: "Public shaming disguised as a changelog.",
    websiteUrl: "https://shiplog.example",
    pitchVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    techStack: ["Astro", "MDX"],
    mrr: 2400,
    elo: 1410,
  },
  {
    twitterId: "t8",
    username: "tabhoarder",
    name: "47 Tabs",
    avatarSeed: "tabs",
    appName: "TabHoarder",
    tagline: "Turns 214 Chrome tabs into 'research'.",
    websiteUrl: "https://tabhoarder.example",
    techStack: ["Extension", "Rust"],
    mrr: 3100,
    elo: 990,
  },
  {
    twitterId: "t9",
    username: "promptpantry",
    name: "Token Chef",
    avatarSeed: "prompt",
    appName: "PromptPantry",
    tagline: "Meal prep for your system prompts.",
    websiteUrl: "https://promptpantry.example",
    techStack: ["Python", "FastAPI"],
    mrr: 1800,
    elo: 1260,
  },
  {
    twitterId: "t10",
    username: "deckdeckgo",
    name: "Slide Lord",
    avatarSeed: "deck",
    appName: "DeckDeckGo",
    tagline: "Pitch decks that pitch themselves.",
    websiteUrl: "https://deckdeckgo.example",
    techStack: ["Remotion", "GPT"],
    mrr: 7200,
    elo: 1550,
    verified: true,
  },
  {
    twitterId: "t11",
    username: "mrrmirror",
    name: "Flex Fiona",
    avatarSeed: "mrr",
    appName: "MRRMirror",
    tagline: "Screenshots of Stripe that may or may not be real.",
    websiteUrl: "https://mrrmirror.example",
    techStack: ["Next.js", "Puppeteer"],
    mrr: 9100,
    elo: 880,
  },
  {
    twitterId: "t12",
    username: "softlaunch",
    name: "Softly Softly",
    avatarSeed: "soft",
    appName: "SoftLaunch",
    tagline: "Launch in stealth until your mom notices.",
    websiteUrl: "https://softlaunch.example",
    techStack: ["Laravel", "Tailwind"],
    mrr: 6400,
    elo: 1320,
  },
  {
    twitterId: "t13",
    username: "tokentoilet",
    name: "Flush Fund",
    avatarSeed: "token",
    appName: "TokenToilet",
    tagline: "We take your tokens out back.",
    websiteUrl: "https://tokentoilet.example",
    techStack: ["Solidity", "Vercel"],
    mrr: 42000,
    elo: 1110,
  },
  {
    twitterId: "t14",
    username: "cloudclown",
    name: "Juggles AWS",
    avatarSeed: "cloud",
    appName: "CloudClown",
    tagline: "Kubernetes for people who just needed a VPS.",
    websiteUrl: "https://cloudclown.example",
    techStack: ["K8s", "Terraform", "Tears"],
    mrr: 28000,
    elo: 1480,
    verified: true,
  },
  {
    twitterId: "t15",
    username: "apibakery",
    name: "REST Baker",
    avatarSeed: "api",
    appName: "APIBakery",
    tagline: "Fresh JSON, baked at 2am.",
    websiteUrl: "https://apibakery.example",
    techStack: ["Hono", "Bun"],
    mrr: 61000,
    elo: 1390,
  },
  {
    twitterId: "t16",
    username: "quietluxury",
    name: "Stealth Wealth",
    avatarSeed: "quiet",
    appName: "QuietLuxuryCRM",
    tagline: "CRM for people who say they don't need a CRM.",
    websiteUrl: "https://quietluxury.example",
    techStack: ["Java", "Salesforce"],
    mrr: 180000,
    elo: 1010,
  },
  {
    twitterId: "t17",
    username: "hedgehogai",
    name: "Spike",
    avatarSeed: "hedge",
    appName: "HedgeHogAI",
    tagline: "An agent that shorts your competitors' waitlists.",
    websiteUrl: "https://hedgehogai.example",
    techStack: ["PyTorch", "Redis"],
    mrr: 240000,
    elo: 1680,
    verified: true,
  },
  {
    twitterId: "t18",
    username: "yachtyaml",
    name: "Captain Config",
    avatarSeed: "yacht",
    appName: "YachtYAML",
    tagline: "Infrastructure as a lifestyle.",
    websiteUrl: "https://yachtyaml.example",
    techStack: ["Pulumi", "Go"],
    mrr: 310000,
    elo: 1220,
  },
  {
    twitterId: "t19",
    username: "gravityos",
    name: "Newton",
    avatarSeed: "gravity",
    appName: "GravityOS",
    tagline: "Operating system for things that fall.",
    websiteUrl: "https://gravityos.example",
    techStack: ["Rust", "WASM"],
    mrr: 720000,
    elo: 1510,
  },
  {
    twitterId: "t20",
    username: "marspayroll",
    name: "Elon Intern",
    avatarSeed: "mars",
    appName: "MarsPayroll",
    tagline: "Pays your team in dust and delusions.",
    websiteUrl: "https://marspayroll.example",
    techStack: ["COBOL", "Starlink"],
    mrr: 1200000,
    elo: 940,
  },
  {
    twitterId: "t21",
    username: "godmodedb",
    name: "Root",
    avatarSeed: "god",
    appName: "GodModeDB",
    tagline: "A database that refuses to SELECT * from reality.",
    websiteUrl: "https://godmodedb.example",
    techStack: ["C++", "io_uring"],
    mrr: 890000,
    elo: 1770,
    verified: true,
  },
];

async function main() {
  await prisma.payment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.app.deleteMany();
  await prisma.user.deleteMany();

  for (const row of SEED) {
    const user = await prisma.user.create({
      data: {
        twitterId: row.twitterId,
        username: row.username,
        name: row.name,
        avatarUrl: `https://api.dicebear.com/9.x/adventurer/png?seed=${row.avatarSeed}`,
      },
    });

    await prisma.app.create({
      data: {
        userId: user.id,
        name: row.appName,
        tagline: row.tagline,
        websiteUrl: row.websiteUrl,
        pitchVideoUrl: row.pitchVideoUrl,
        screenshotUrl: `https://picsum.photos/seed/${row.username}/1200/800`,
        techStack: row.techStack,
        mrrAmount: new Prisma.Decimal(row.mrr),
        isVerified: Boolean(row.verified),
        eloScore: row.elo ?? DEFAULT_ELO,
      },
    });
  }

  console.log(`Seeded ${SEED.length} founders.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
