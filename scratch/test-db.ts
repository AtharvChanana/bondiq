import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    const count = await prisma.user.count()
    console.log("CONNECTION SUCCESS! User count:", count)
  } catch (e) {
    console.error("CONNECTION FAILED:", e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
