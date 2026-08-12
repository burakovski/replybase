import { LandingPage } from "@/components/landing-page";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  return <LandingPage signedIn={!!user} />;
}
