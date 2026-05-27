import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seed() {
  const user = await prisma.user.findFirst()
  if (!user) { console.log("No user found"); return; }
  
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const dummy = await prisma.person.create({
    data: {
      userId: user.id,
      name: "Marcus Aurelius",
      relationship: "friend",
      howWeMet: "Met at a Stoicism conference in Rome",
      currentSituation: "Emperor of Rome, currently writing Meditations",
      whatMattersToThem: "Virtue, duty, and accepting fate",
      lastContactedAt: threeMonthsAgo,
      healthScore: 30, // low health score because it has been 3 months
    }
  });
  
  console.log("Created dummy person:", dummy.id);
  
  const interaction = await prisma.interaction.create({
    data: {
      userId: user.id,
      personId: dummy.id,
      type: "text_log",
      rawContent: "Had coffee at the local roastery. We talked about how difficult it is to manage the Germanic tribes. He seemed a bit stressed but resolute.",
      summary: "Discussed the challenges of leadership and his current focus on writing his journal.",
      sentiment: "neutral",
      extractionStatus: "completed",
      createdAt: threeMonthsAgo,
    }
  });
  console.log("Created interaction:", interaction.id);
}

seed().catch(console.error).finally(() => prisma.$disconnect());
