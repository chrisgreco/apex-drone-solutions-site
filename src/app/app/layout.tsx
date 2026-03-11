import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/platform/shell/AppShell";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Login page renders without the shell
  if (!user) {
    return <>{children}</>;
  }

  // Fetch profile name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <AppShell userName={profile?.full_name || user.email}>
      {children}
    </AppShell>
  );
}
