import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const mockUserId = "local_dev_user_id"

  console.log("Cleaning database...")
  await prisma.user.deleteMany().catch(() => {})
  await prisma.person.deleteMany().catch(() => {})

  console.log("Upserting mock local developer user...")
  const devUser = await prisma.user.upsert({
    where: { id: mockUserId },
    update: {
      email: "developer@bondiq.com",
      name: "Local Developer",
      avatar: null,
    },
    create: {
      id: mockUserId,
      email: "developer@bondiq.com",
      name: "Local Developer",
      avatar: null,
    },
  })

  console.log("Creating dummy relationships data...")

  // 1. Sarah Jenkins (Friend - High score)
  const sarah = await prisma.person.create({
    data: {
      userId: devUser.id,
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      relationship: "friend",
      howWeMet: "Met during our college freshman orientation in 2018 when we both accidentally took the wrong campus tour.",
      currentSituation: "Just started a new job as a UX designer at a fintech startup in San Francisco. Training for her first half-marathon.",
      whatMattersToThem: "Values deep, authentic catchups over a good cup of light roast coffee. Loves talking about product design, psychology, and trail running.",
      phone: "+1 (555) 321-9876",
      healthScore: 95,
      lastContactedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      milestones: {
        create: [
          { title: "Sarah's Birthday", date: new Date("2026-09-12"), isRecurring: true },
          { title: "SF Half Marathon Race Day", date: new Date("2026-10-18"), isRecurring: false },
        ]
      },
      memories: {
        create: [
          { category: "personal_detail", content: "Passionate about specialty pour-overs, hates artificially flavored hazelnut syrup.", importance: "medium" },
          { category: "career", content: "Transitioned from product manager to senior UX designer last year.", importance: "medium" },
          { category: "dream", content: "Wants to eventually start her own boutique design agency or design wellness apps.", importance: "high" },
        ]
      },
      interactions: {
        create: [
          {
            userId: devUser.id,
            type: "text_log",
            rawContent: "Had a wonderful call with Sarah today. She shared how her first week at the new job went. She was super energized but a bit overwhelmed with onboarding. We made plans to grab coffee next month when I am in SF. She mentioned her marathon training is going well but her knee has been a bit sore.",
            summary: "Catch up on new design job and marathon prep",
            sentiment: "positive",
            extractionStatus: "completed",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    }
  })

  // 2. Marcus Chen (Mentor - Good score)
  const marcus = await prisma.person.create({
    data: {
      userId: devUser.id,
      name: "Marcus Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      relationship: "mentor",
      howWeMet: "Met at a local startup hackathon in 2022 where he was a judge and gave me constructive feedback on our pitch deck.",
      currentSituation: "Currently raising a Series A round for his cybersecurity startup. Just bought a new house in Austin.",
      whatMattersToThem: "Appreciates highly concise status updates, punctuality, and strategic thinking. Extremely values family, mentorship, and high integrity.",
      phone: "+1 (555) 765-4321",
      healthScore: 85,
      lastContactedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      milestones: {
        create: [
          { title: "Startup Series A Funding Milestone", date: new Date("2026-07-01"), isRecurring: false },
        ]
      },
      memories: {
        create: [
          { category: "career", content: "Sold his previous SaaS company for $12M back in 2021.", importance: "high" },
          { category: "hobby", content: "Avid tennis player and collects rare science fiction books.", importance: "low" },
        ]
      },
      interactions: {
        create: [
          {
            userId: devUser.id,
            type: "voice_log",
            rawContent: "Met Marcus at the tech club. He advised me to focus on early customer retention metrics rather than getting distracted by vanity marketing. He also recommended two startup books that influenced him early on. He seems pleased with my progress.",
            summary: "Strategic advisory on SaaS growth metrics",
            sentiment: "positive",
            extractionStatus: "completed",
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    }
  })

  // 3. Emily Rodriguez (Sister - Low score / Fading)
  const emily = await prisma.person.create({
    data: {
      userId: devUser.id,
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      relationship: "family",
      howWeMet: "Siblings",
      currentSituation: "Relocating from Chicago to Seattle next week. Dealing with the stress of packing and finding a dog-friendly apartment.",
      whatMattersToThem: "Consistency and simple reachouts. Loves dogs, hiking, vegetarian cooking, and getting postcard updates.",
      phone: "+1 (555) 890-1234",
      healthScore: 40,
      lastContactedAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000), // 42 days ago
      milestones: {
        create: [
          { title: "Move to Seattle relocation", date: new Date("2026-06-01"), isRecurring: false },
          { title: "Emily's Birthday", date: new Date("2026-04-25"), isRecurring: true },
        ]
      },
      memories: {
        create: [
          { category: "personal_detail", content: "Has a golden retriever named Bruno who is her absolute world.", importance: "high" },
          { category: "hobby", content: "Bakes exceptional sourdough bread but gets frustrated when the starter doesn't rise.", importance: "medium" },
        ]
      },
      interactions: {
        create: [
          {
            userId: devUser.id,
            type: "text_log",
            rawContent: "Messaged Emily to check on her packing. She said she's feeling completely exhausted and overwhelmed. Bruno got stressed by the cardboard boxes. I offered to help her look for Seattle pet policies but didn't hear back yet. Need to follow up and make sure she's doing okay.",
            summary: "Checking in on Seattle relocation stress",
            sentiment: "neutral",
            extractionStatus: "completed",
            createdAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    }
  })

  // 4. David Kim (Friend - Medium-low score)
  const david = await prisma.person.create({
    data: {
      userId: devUser.id,
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      relationship: "friend",
      howWeMet: "High school chemistry lab partners in 2014.",
      currentSituation: "Working in real estate development. Recently got engaged to his partner Clara.",
      whatMattersToThem: "Values reminiscing about high school days, sports (loves NBA), and keeping in touch despite busy schedules.",
      phone: "+1 (555) 456-7890",
      healthScore: 60,
      lastContactedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
      milestones: {
        create: [
          { title: "Wedding Day with Clara", date: new Date("2026-09-05"), isRecurring: false },
        ]
      },
      memories: {
        create: [
          { category: "personal_detail", content: "Engaged to Clara, proposed during a trip to Banff National Park.", importance: "high" },
          { category: "hobby", content: "Die-hard Golden State Warriors basketball fan.", importance: "low" },
        ]
      },
      interactions: {
        create: [
          {
            userId: devUser.id,
            type: "text_log",
            rawContent: "Briefly chatted with Dave on Instagram. He confirmed the wedding date is September 5th. He asked how I was doing. I told him we should grab dinner next time he's in town.",
            summary: "Short catch-up regarding wedding planning",
            sentiment: "positive",
            extractionStatus: "completed",
            createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    }
  })

  // 5. Elena Petrova (Colleague - High score)
  const elena = await prisma.person.create({
    data: {
      userId: devUser.id,
      name: "Elena Petrova",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      relationship: "colleague",
      howWeMet: "Joined the engineering department in the same cohort in 2024.",
      currentSituation: "Leads the core platform scaling team. Working on a massive database migration project.",
      whatMattersToThem: "Clear technical arguments, collaborative work, and deep curiosity. Loves board games and cycling.",
      phone: "+1 (555) 901-2345",
      healthScore: 90,
      lastContactedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      milestones: {
        create: [
          { title: "Database Migration Launch", date: new Date("2026-06-15"), isRecurring: false },
        ]
      },
      memories: {
        create: [
          { category: "hobby", content: "Enjoys advanced board games like Settlers of Catan and Terraforming Mars.", importance: "medium" },
          { category: "personal_detail", content: "Rides her road bike 50 miles every Saturday morning.", importance: "medium" },
        ]
      },
      interactions: {
        create: [
          {
            userId: devUser.id,
            type: "text_log",
            rawContent: "Had lunch with Elena. We talked about database clustering architectures and then digressed into discussing board game strategies. She invited me to her weekly board game night next Thursday.",
            summary: "Colleague lunch and board game chat",
            sentiment: "positive",
            extractionStatus: "completed",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    }
  })

  // Create some simple nudges to showcase on dashboard!
  console.log("Creating dummy nudges data...")
  await prisma.nudge.createMany({
    data: [
      {
        userId: devUser.id,
        personId: emily.id,
        reason: "You haven't contacted Emily in 6 weeks! Ask her how the Seattle relocation packing is progressing.",
        status: "pending",
        nudgeKey: "fading_relationship",
      },
      {
        userId: devUser.id,
        personId: david.id,
        reason: "David's wedding is coming up! Reach out to congratulate him on the planning.",
        status: "pending",
        nudgeKey: "upcoming_milestone",
      }
    ]
  })

  console.log("Database seeded successfully with premium relationships mock data!")
}

main()
  .catch((e) => {
    console.error("Seeding failed: ", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
