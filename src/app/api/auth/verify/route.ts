import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, publicUser, verifySignupOtp } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  token: z.string().trim().min(1, "Enter the code from your email"),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const user = await verifySignupOtp({
      email: body.email,
      token: body.token,
    });
    return NextResponse.json({ user: publicUser(user) });
  } catch (e) {
    if (e instanceof z.ZodError) {
      const first = e.issues[0];
      return NextResponse.json(
        { error: first?.message || "Incorrect code", code: "invalid_otp" },
        { status: 400 },
      );
    }
    if (e instanceof AuthError) {
      return NextResponse.json(
        { error: e.message, code: e.code },
        { status: 400 },
      );
    }
    const message = e instanceof Error ? e.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
