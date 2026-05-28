import { redirect } from "next/navigation"
import { format } from "date-fns"
import { getServerSession } from "@/server/lib/auth"
import { prisma } from "@/server/lib/prisma"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const session = await getServerSession()

  // Restrict access to admin only
  if (!session?.user || session.user.email !== "bondiq.admin@gmail.com") {
    return redirect("/dashboard")
  }

  const [users, visitsCount] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { people: true, interactions: true },
        },
      },
    }),
    prisma.siteVisit.count(),
  ])

  const rawVisits = await prisma.siteVisit.findMany({
    orderBy: { createdAt: "desc" },
    take: 5000,
  })

  // Group visits by IP and UserAgent
  const groupedVisits = Object.values(
    rawVisits.reduce((acc, visit) => {
      const key = `${visit.ip}-${visit.userAgent}`
      if (!acc[key]) {
        acc[key] = {
          id: visit.id,
          ip: visit.ip,
          userAgent: visit.userAgent,
          createdAt: visit.createdAt,
          count: 1,
        }
      } else {
        acc[key].count++
      }
      return acc
    }, {} as Record<string, any>)
  ).slice(0, 100) // only show top 100 unique visitors

  return (
    <div className="flex flex-col gap-8 pb-16">
      <div className="bg-[#CCFF00] p-6 border-4 border-black">
        <h1
          className="text-2xl font-black uppercase tracking-widest text-black m-0"
          style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)" }}
        >
          Admin Dashboard
        </h1>
        <p className="font-mono text-sm text-black mt-2 font-bold uppercase">
          Welcome back, Admin. System is running.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border-4 border-black flex flex-col items-center justify-center py-12">
          <span className="font-mono text-sm text-gray-500 uppercase font-bold tracking-widest mb-2">Total Users</span>
          <span className="text-6xl text-black font-black tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>
            {users.length}
          </span>
        </div>
        <div className="bg-white p-6 border-4 border-black flex flex-col items-center justify-center py-12">
          <span className="font-mono text-sm text-gray-500 uppercase font-bold tracking-widest mb-2">Total Visits</span>
          <span className="text-6xl text-black font-black tracking-tighter" style={{ fontFamily: "var(--font-jakarta)" }}>
            {visitsCount}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-black uppercase tracking-widest text-white bg-black p-3 inline-block self-start border-2 border-black" style={{ fontFamily: "var(--font-jakarta)" }}>
          Registered Users
        </h2>
        <div className="bg-white border-4 border-black overflow-x-auto hide-scrollbar">
          <table className="w-full text-left font-mono text-sm border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 border-b-4 border-black text-black">
                <th className="p-3 border-r-2 border-black uppercase tracking-wider font-bold">Email</th>
                <th className="p-3 border-r-2 border-black uppercase tracking-wider font-bold">Name</th>
                <th className="p-3 border-r-2 border-black uppercase tracking-wider font-bold">Joined</th>
                <th className="p-3 border-r-2 border-black uppercase tracking-wider font-bold">People</th>
                <th className="p-3 uppercase tracking-wider font-bold">Interactions</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {users.map((user) => (
                <tr key={user.id} className="border-b-2 border-gray-200 last:border-0 hover:bg-[#CCFF00] transition-colors duration-0">
                  <td className="p-3 border-r-2 border-black truncate max-w-[200px]">{user.email}</td>
                  <td className="p-3 border-r-2 border-black truncate max-w-[150px]">{user.name ?? "-"}</td>
                  <td className="p-3 border-r-2 border-black">{format(new Date(user.createdAt), "MMM d, yyyy")}</td>
                  <td className="p-3 border-r-2 border-black font-bold">{user._count.people}</td>
                  <td className="p-3 font-bold">{user._count.interactions}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500 font-bold uppercase">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-black uppercase tracking-widest text-white bg-black p-3 inline-block self-start border-2 border-black" style={{ fontFamily: "var(--font-jakarta)" }}>
          Unique Visitors (Grouped by IP)
        </h2>
        <div className="bg-white border-4 border-black overflow-x-auto hide-scrollbar">
          <table className="w-full text-left font-mono text-xs border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 border-b-4 border-black text-black">
                <th className="p-3 border-r-2 border-black uppercase tracking-wider font-bold">Last Visit (IST)</th>
                <th className="p-3 border-r-2 border-black uppercase tracking-wider font-bold">IP Address</th>
                <th className="p-3 border-r-2 border-black uppercase tracking-wider font-bold">Device / Browser</th>
                <th className="p-3 uppercase tracking-wider font-bold">Visits</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {groupedVisits.map((visit) => (
                <tr key={visit.id} className="border-b-2 border-gray-200 last:border-0 hover:bg-black hover:text-[#CCFF00] transition-colors duration-0">
                  <td className="p-3 border-r-2 border-inherit whitespace-nowrap">
                    {new Intl.DateTimeFormat("en-IN", {
                      timeZone: "Asia/Kolkata",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(visit.createdAt))}
                  </td>
                  <td className="p-3 border-r-2 border-inherit font-bold">{visit.ip}</td>
                  <td className="p-3 border-r-2 border-inherit truncate max-w-[300px]" title={visit.userAgent ?? ""}>
                    {visit.userAgent ?? "Unknown"}
                  </td>
                  <td className="p-3 font-bold">{visit.count}</td>
                </tr>
              ))}
              {groupedVisits.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500 font-bold uppercase">No visits recorded yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
