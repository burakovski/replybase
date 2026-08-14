import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PlanId, User } from "./types";

type ProfileRow = {
  id: string;
  email: string;
  name: string;
  plan: PlanId;
  created_at: string;
};

export class AuthError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

function mapUser(row: ProfileRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    plan: row.plan,
    createdAt: row.created_at,
  };
}

async function ensureProfile(input: {
  userId: string;
  email: string;
  name?: string | null;
}): Promise<User> {
  const admin = createSupabaseAdmin();
  const email = input.email.trim().toLowerCase();
  const name =
    (input.name || "").trim() || email.split("@")[0] || "User";

  await admin.from("profiles").upsert(
    {
      id: input.userId,
      email,
      name,
      plan: "free",
    },
    { onConflict: "id" },
  );

  const { data: profile, error } = await admin
    .from("profiles")
    .select("id,email,name,plan,created_at")
    .eq("id", input.userId)
    .single();

  if (error || !profile) {
    throw new Error(error?.message || "Profile missing after signup");
  }

  return mapUser(profile as ProfileRow);
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id,email,name,plan,created_at")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) return null;
    return mapUser(profile as ProfileRow);
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export type SignUpResult =
  | { status: "authenticated"; user: User }
  | { status: "needs_confirmation"; email: string };

export async function signUpUser(input: {
  email: string;
  password: string;
  name: string;
}): Promise<SignUpResult> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim() || email.split("@")[0] || "User";
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: { name },
    },
  });

  if (error) throw new Error(error.message);

  // Confirm email disabled in Supabase → session arrives immediately.
  if (data.session && data.user) {
    const user = await ensureProfile({
      userId: data.user.id,
      email,
      name: (data.user.user_metadata?.name as string | undefined) || name,
    });
    return { status: "authenticated", user };
  }

  if (!data.user) {
    throw new Error("Signup failed");
  }

  // Unconfirmed user: profile may already exist via trigger; keep name in sync.
  await ensureProfile({
    userId: data.user.id,
    email,
    name,
  });

  return { status: "needs_confirmation", email };
}

export async function verifySignupOtp(input: {
  email: string;
  token: string;
}): Promise<User> {
  const email = input.email.trim().toLowerCase();
  const token = input.token.trim().replace(/\s+/g, "");
  const supabase = await createSupabaseServerClient();

  let { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });

  // Some projects deliver signup OTP under type "email".
  if (error) {
    const retry = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    throw new AuthError("invalid_otp", "Incorrect code");
  }
  if (!data.user) {
    throw new AuthError("invalid_otp", "Incorrect code");
  }

  return ensureProfile({
    userId: data.user.id,
    email: data.user.email || email,
    name: data.user.user_metadata?.name as string | undefined,
  });
}

export async function resendSignupOtp(emailRaw: string): Promise<void> {
  const email = emailRaw.trim().toLowerCase();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });
  if (error) throw new Error(error.message);
}

export async function signInUser(input: {
  email: string;
  password: string;
}): Promise<User> {
  const email = input.email.trim().toLowerCase();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("email not confirmed")) {
      throw new AuthError(
        "email_not_confirmed",
        "Confirm your email with the code we sent you",
      );
    }
    throw new Error("Invalid email or password");
  }
  if (!data.user) throw new Error("Login failed");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,email,name,plan,created_at")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    return ensureProfile({
      userId: data.user.id,
      email: data.user.email || email,
      name: data.user.user_metadata?.name as string | undefined,
    });
  }

  return mapUser(profile as ProfileRow);
}

export async function signOutUser() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}

export async function setUserPlan(userId: string, plan: PlanId) {
  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("profiles")
    .update({ plan })
    .eq("id", userId);
  if (error) throw new Error(error.message);
}

export function publicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    createdAt: user.createdAt,
  };
}
