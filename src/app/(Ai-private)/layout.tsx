import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AiPrivateLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data?.user) {
    return redirect("/");
  }

  return <>{children}</>;
}
