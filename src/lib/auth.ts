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

function mapUser(row: ProfileRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    plan: row.plan,
    createdAt: row.created_at,
  };
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

export async function signUpUser(input: {
  email: string;
  password: string;
  name: string;
}): Promise<User> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim() || email.split("@")[0] || "User";
  const admin = createSupabaseAdmin();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (createError) throw new Error(createError.message);
  if (!created.user) throw new Error("Signup failed");

  await admin.from("profiles").upsert(
    {
      id: created.user.id,
      email,
      name,
      plan: "free",
    },
    { onConflict: "id" },
  );

  const supabase = await createSupabaseServerClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });
  if (signInError) throw new Error(signInError.message);

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id,email,name,plan,created_at")
    .eq("id", created.user.id)
    .single();

  if (profileError || !profile) {
    throw new Error(profileError?.message || "Profile missing after signup");
  }

  return mapUser(profile as ProfileRow);
}

export async function signInUser(input: {
  email: string;
  password: string;
}): Promise<User> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim().toLowerCase(),
    password: input.password,
  });

  if (error) throw new Error("Invalid email or password");
  if (!data.user) throw new Error("Login failed");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,email,name,plan,created_at")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    throw new Error(profileError?.message || "Profile not found");
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
