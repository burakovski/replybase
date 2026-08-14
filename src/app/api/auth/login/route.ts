import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, publicUser, signInUser } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const user = await signInUser({
      email: body.email,
      password: body.password,
    });
    return NextResponse.json({ user: publicUser(user) });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json(
        { error: e.message, code: e.code },
        { status: 403 },
      );
    }
    const message = e instanceof Error ? e.message : "Login failed";
    const status = message.includes("Invalid") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
