import { redirect } from "next/navigation"
import { DashboardPage } from "@/features/dashboard"
import { getServerSession } from "@/server/lib/auth"

export default async function Page() {
  const session = await getServerSession()
  
  if (session?.user?.email === "bondiq.admin@gmail.com") {
    return redirect("/admin")
  }

  return <DashboardPage />
}
