import type { PlanId } from "./types";

export const PLANS = [
  {
    id: "free" as const,
    name: "Free",
    price: "$0",
    period: "forever",
    bots: 1,
    docs: 3,
    messages: 50,
    embed: false,
    highlight: false,
    blurb: "Try Replybase on one help center.",
    features: [
      "1 chatbot",
      "Up to 3 documents",
      "50 chat replies / month",
      "In-app chat only",
    ],
  },
  {
    id: "starter" as const,
    name: "Starter",
    price: "$29",
    period: "/ month",
    bots: 3,
    docs: 30,
    messages: 2_000,
    embed: true,
    highlight: true,
    blurb: "Ship an embeddable widget on your marketing site.",
    features: [
      "3 chatbots",
      "30 documents",
      "2,000 replies / month",
      "Embeddable website widget",
      "Custom brand color",
    ],
  },
  {
    id: "growth" as const,
    name: "Growth",
    price: "$79",
    period: "/ month",
    bots: 10,
    docs: 200,
    messages: 15_000,
    embed: true,
    highlight: false,
    blurb: "For SaaS teams with multiple products or locales.",
    features: [
      "10 chatbots",
      "200 documents",
      "15,000 replies / month",
      "Embed widget + priority replies",
      "Remove Replybase badge",
    ],
  },
] as const;

export function planLimits(plan: PlanId) {
  return PLANS.find((p) => p.id === plan)!;
}

export function canEmbed(plan: PlanId) {
  return planLimits(plan).embed;
}
