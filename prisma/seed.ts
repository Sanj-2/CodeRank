import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const FIRST_NAMES = [
  "Aman", "Priya", "Rohan", "Ishita", "Karan", "Sneha", "Vikram", "Ananya",
  "Aditya", "Riya", "Dev", "Tanya", "Arjun", "Megha", "Yash",
];
const LAST_NAMES = [
  "Sharma", "Gupta", "Verma", "Singh", "Kumar", "Patel", "Mehta", "Joshi",
];
const BRANCHES = ["CO", "IT", "ECE", "EE", "ME", "CE"];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const password = await bcrypt.hash("Password123", 12);
  const year = 2022;

  for (let i = 0; i < FIRST_NAMES.length; i++) {
    const first = FIRST_NAMES[i];
    const last = LAST_NAMES[i % LAST_NAMES.length];
    const branch = BRANCHES[i % BRANCHES.length];
    const rollNumber = `2K${year - 2018}-${branch}-${String(100 + i)}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@dtu.ac.in`;
    const leetcodeUsername = `${first.toLowerCase()}${last.toLowerCase()}${i}`;

    const easy = randInt(40, 200);
    const medium = randInt(30, 250);
    const hard = randInt(5, 80);
    const total = easy + medium + hard;

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: `${first} ${last}`,
        rollNumber,
        email,
        password,
        leetcodeUsername,
        branch,
        graduationYear: year,
      },
    });

    await prisma.leetCodeStats.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        totalSolved: total,
        easySolved: easy,
        mediumSolved: medium,
        hardSolved: hard,
        acceptanceRate: Number(randInt(40, 75).toFixed(1)),
        contestRating: Math.random() > 0.2 ? randInt(1300, 2100) : null,
        globalRanking: randInt(5000, 800000),
        badges: [],
      },
    });

    // Backfill ~14 days of snapshot history so the activity heatmap has something to show.
    for (let day = 13; day >= 0; day--) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setHours(0, 0, 0, 0);

      const progressFraction = (14 - day) / 14;
      await prisma.statsSnapshot.upsert({
        where: { userId_date: { userId: user.id, date } },
        update: {},
        create: {
          userId: user.id,
          date,
          totalSolved: Math.round(total * progressFraction),
          easySolved: Math.round(easy * progressFraction),
          mediumSolved: Math.round(medium * progressFraction),
          hardSolved: Math.round(hard * progressFraction),
        },
      });
    }
  }

  console.log(`Seeded ${FIRST_NAMES.length} students. All passwords: Password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
