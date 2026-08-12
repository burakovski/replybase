import { NextResponse } from "next/server";
import { z } from "zod";
import { publicUser, signUpUser } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(80).optional(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const user = await signUpUser({
      email: body.email,
      password: body.password,
      name: body.name || body.email.split("@")[0] || "User",
    });
    return NextResponse.json({ user: publicUser(user) });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Signup failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
