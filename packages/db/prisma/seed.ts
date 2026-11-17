import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash("admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@dinkourt.com" },
    update: {},
    create: { name: "DinkHub Admin", email: "admin@dinkourt.com", passwordHash: adminHash, role: "SUPER_ADMIN" },
  });
  console.log("Admin:", admin.email);

  const ownerHash = await bcrypt.hash("owner123!", 12);
  const ownerUser = await prisma.user.upsert({
    where: { email: "owner@dinkourt.com" },
    update: {},
    create: {
      name: "Juan dela Cruz", email: "owner@dinkourt.com", passwordHash: ownerHash, role: "OWNER",
      ownerProfile: { create: { businessName: "Dink Masters PH", status: "APPROVED" } },
    },
  });
  console.log("Owner:", ownerUser.email);

  const owner = await prisma.owner.findUnique({ where: { userId: ownerUser.id } });

  const venue = await prisma.venue.upsert({
    where: { slug: "dink-masters-bgc" },
    update: {},
    create: {
      ownerId: owner!.id,
      name: "Dink Masters BGC",
      slug: "dink-masters-bgc",
      address: "26th St, Bonifacio Global City",
      city: "Taguig",
      province: "Metro Manila",
      status: "ACTIVE",
    },
  });
  console.log("Venue:", venue.name);

  await prisma.bookingFeeConfig.upsert({
    where: { venueId: venue.id },
    update: {},
    create: { venueId: venue.id, feeType: "FIXED", fixedAmount: 50, chargedTo: "PLAYER" },
  });

  const court = await prisma.court.create({
    data: { venueId: venue.id, name: "Court 1", hourlyRate: 500 },
  });
  console.log("Court:", court.name);

  await prisma.membershipPlan.create({
    data: {
      venueId: venue.id,
      name: "Monthly Member",
      interval: "MONTHLY",
      price: 1500,
      bookingDiscount: 0.1,
      benefits: ["10% booking discount", "Priority booking"],
    },
  });

  await prisma.saasplan.upsert({
    where: { id: "plan_business" },
    update: {},
    create: {
      id: "plan_business",
      name: "Business",
      monthlyPrice: 1699,
      annualPrice: 16990,
      features: ["Unlimited courts", "Tournaments", "Memberships", "Analytics"],
    },
  });

  const playerHash = await bcrypt.hash("player123!", 12);
  await prisma.user.upsert({
    where: { email: "player@dinkourt.com" },
    update: {},
    create: {
      name: "Maria Santos", email: "player@dinkourt.com", passwordHash: playerHash, role: "PLAYER",
      playerProfile: { create: { skillLevel: "Intermediate" } },
    },
  });
  console.log("Seed complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
