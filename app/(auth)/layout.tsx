import { redirect } from "next/navigation"
import { createClient } from "@/app/lib/supabase/server-client"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect("/dashboard")

  return <>{children}</>
}
