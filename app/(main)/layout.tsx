import { redirect } from "next/navigation"
import { createClient } from "@/app/lib/supabase/server-client"
import Header from "@/app/components/global/Header"
import Footer from "@/app/components/global/Footer"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return (
    <div className="w-full min-h-full flex flex-col bg-zinc-950">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
