import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, publicUser, setUserPlan } from "@/lib/auth";
import { PLANS } from "@/lib/plans";
import type { PlanId } from "@/lib/types";

const schema = z.object({
  plan: z.enum(["free", "starter", "growth"]),
  // Mock Stripe checkout — no live charges
  mockPaymentMethod: z.string().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    plan: user.plan,
    plans: PLANS,
    billing: {
      provider: "stripe-test-mock",
      note: "No live charges. Selecting a paid plan simulates a successful Stripe checkout.",
    },
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = schema.parse(await req.json());
    const plan = body.plan as PlanId;

    // Mock Stripe: pretend payment succeeded for paid plans
    if (plan !== "free") {
      await new Promise((r) => setTimeout(r, 400));
    }

    await setUserPlan(user.id, plan);
    const updated = { ...user, plan };
    return NextResponse.json({
      user: publicUser(updated),
      receipt: {
        id: `mock_ch_${Date.now()}`,
        plan,
        status: "succeeded",
        amount:
          plan === "free" ? 0 : plan === "starter" ? 2900 : 7900,
        currency: "usd",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Billing failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
