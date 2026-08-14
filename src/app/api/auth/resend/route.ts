import { NextResponse } from "next/server";
import { z } from "zod";
import { resendSignupOtp } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    await resendSignupOtp(body.email);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not resend code";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
