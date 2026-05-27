import { PeopleService } from "./server/services/people.service"
import { prisma } from "./server/lib/prisma"

async function test() {
  const person = await prisma.person.findFirst();
  if (!person) return console.log("No person");
  try {
    await PeopleService.update(person.userId, person.id, { howWeMet: "test" });
    console.log("SUCCESS");
  } catch(e: any) {
    console.error("ERROR:", e.message);
  }
}
test();
