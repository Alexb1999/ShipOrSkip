import type { TierSlug } from "@/lib/tiers";
import { getTierBySlug } from "@/lib/tiers";

export type IndieVoice = {
  name: string;
  handle: string;
  portrait: string;
};

export type IndieQuote = {
  voice: IndieVoice;
  quote: string;
};

function voice(name: string, handle: string): IndieVoice {
  return {
    name,
    handle,
    portrait: `https://unavatar.io/x/${handle}`,
  };
}

export const TIER_LEGENDS: Record<TierSlug, IndieVoice> = {
  homeless: voice("Alex", "alexcooldev"),
  pity_purchase: voice("Rob", "robj3d3"),
  ramen: voice("Tiago", "tdinh_me"),
  still_9_5: voice("Marc Köhlbrugge", "marckohlbrugge"),
  no_more_9_5: voice("Daniel Vassallo", "dvassallo"),
  rich_af: voice("Marc Lou", "marclou"),
  fuck_you_money: voice("Pieter Levels", "levelsio"),
  billionaire_path: voice("Vitalii Dodonov", "vitaliidodonov"),
};

export const TIER_QUOTES: Record<TierSlug, IndieQuote[]> = {
  homeless: [
    {
      voice: TIER_LEGENDS.homeless,
      quote: "Zero dollars. Infinite tweets. A waitlist is not a company, it's a coping document.",
    },
    {
      voice: TIER_LEGENDS.homeless,
      quote: "You're not 'pre-revenue.' You're unemployed with a domain.",
    },
  ],
  pity_purchase: [
    {
      voice: TIER_LEGENDS.pity_purchase,
      quote: "One Stripe ping and you're posting 'we hit PMF.' Your mom bought the lifetime deal.",
    },
    {
      voice: TIER_LEGENDS.pity_purchase,
      quote: "Congrats on the $9. That's not MRR. That's a tip with extra steps.",
    },
  ],
  ramen: [
    {
      voice: TIER_LEGENDS.ramen,
      quote: "Ramen profitable. Cute. Your landlord still wants to be paid in currency, not vibes.",
    },
    {
      voice: TIER_LEGENDS.ramen,
      quote: "You covered groceries and called it a startup. The noodles are not a moat.",
    },
  ],
  still_9_5: [
    {
      voice: TIER_LEGENDS.still_9_5,
      quote: "Same money as a job, none of the benefits, twice the Slack. You didn't escape. You rebranded.",
    },
    {
      voice: TIER_LEGENDS.still_9_5,
      quote: "You can almost quit. Almost. Health insurance not included. The WIP streak is.",
    },
  ],
  no_more_9_5: [
    {
      voice: TIER_LEGENDS.no_more_9_5,
      quote: "You quit. Now you work 80 hours and call it freedom. The boss is you, and you're a tyrant.",
    },
    {
      voice: TIER_LEGENDS.no_more_9_5,
      quote: "Quit-lit is not a business model. It's a LinkedIn genre.",
    },
  ],
  rich_af: [
    {
      voice: TIER_LEGENDS.rich_af,
      quote: "Stop calling it a side project. This prints more than your old boss and you still tweet like you're broke.",
    },
    {
      voice: TIER_LEGENDS.rich_af,
      quote: "Build in public at $40k MRR is not humility. It's content.",
    },
  ],
  fuck_you_money: [
    {
      voice: TIER_LEGENDS.fuck_you_money,
      quote: "You could disappear. You won't. You'll screenshot the dashboard at 1am like a gremlin.",
    },
    {
      voice: TIER_LEGENDS.fuck_you_money,
      quote: "Fuck you money, still answering support tickets. That's not hustle. That's an identity crisis.",
    },
  ],
  billionaire_path: [
    {
      voice: TIER_LEGENDS.billionaire_path,
      quote: "This isn't indie. It's a tax strategy with a landing page. Touch grass. You won't.",
    },
    {
      voice: TIER_LEGENDS.billionaire_path,
      quote: "Half a million a month and you're still in the replies. Get a yacht or get therapy.",
    },
  ],
};

export function quoteFor(slug: string, seed = ""): IndieQuote {
  const resolved = getTierBySlug(slug)?.slug ?? "homeless";
  const list = TIER_QUOTES[resolved];
  if (!seed) return list[0];
  const total = [...seed].reduce((n, c) => n + c.charCodeAt(0), 0);
  return list[total % list.length];
}
