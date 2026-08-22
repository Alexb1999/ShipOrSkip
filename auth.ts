import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";

const twitterConfigured = Boolean(
  process.env.AUTH_TWITTER_ID && process.env.AUTH_TWITTER_SECRET,
);

async function upsertDemoUser() {
  return prisma.user.upsert({
    where: { username: "demo_hacker" },
    update: {},
    create: {
      twitterId: "demo",
      username: "demo_hacker",
      name: "Demo Hacker",
      avatarUrl: "https://api.dicebear.com/9.x/adventurer/png?seed=demo",
    },
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [
    ...(twitterConfigured
      ? [
          Twitter({
            clientId: process.env.AUTH_TWITTER_ID,
            clientSecret: process.env.AUTH_TWITTER_SECRET,
          }),
        ]
      : []),
    Credentials({
      id: "demo",
      name: "Demo",
      credentials: {},
      async authorize() {
        const user = await upsertDemoUser();
        return {
          id: user.id,
          name: user.name,
          image: user.avatarUrl,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile, account }) {
      if (account?.provider === "twitter" && profile) {
        const data = (profile as { data?: { id?: string; username?: string; name?: string; profile_image_url?: string } }).data;
        const twitterId = data?.id ?? account.providerAccountId;
        const username = (data?.username ?? `x_${twitterId}`).toLowerCase();
        const avatar =
          data?.profile_image_url?.replace("_normal", "") ??
          (typeof user?.image === "string" ? user.image : null);

        const dbUser = await prisma.user.upsert({
          where: { twitterId },
          update: {
            username,
            name: data?.name ?? user?.name,
            avatarUrl: avatar,
          },
          create: {
            twitterId,
            username,
            name: data?.name ?? user?.name ?? username,
            avatarUrl: avatar,
          },
        });
        token.id = dbUser.id;
        token.username = dbUser.username;
        token.picture = dbUser.avatarUrl;
        token.name = dbUser.name;
      }

      if (user?.id) {
        token.id = user.id;
        const username = (user as { username?: string }).username;
        if (username) token.username = username;
        if (user.image) token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.username = String(token.username ?? "anon");
        session.user.image = (token.picture as string | undefined) ?? session.user.image;
      }
      return session;
    },
  },
});

export const twitterAuthEnabled = twitterConfigured;
