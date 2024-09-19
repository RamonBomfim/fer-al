import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { productTypes, date, location } = body;
  const today = new Date().getDate();
  const treatDate = new Date(date).getDate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any = {
    date: {
      gte: new Date(new Date().setHours(0, 0, 0, 0)),
    },
    ...(productTypes ? { productTypes } : {}),
    ...(location ? { local: { contains: location, mode: 'insensitive' } } : {}),
    ...(treatDate >= today ? { date: new Date(date) } : {}),
  };

  try {
    const fairs = await prisma.fair.findMany({
      where: filters,
      include: {
        vendors: true,
        organizer: true,
      },
    });

    if (!fairs.length) {
      return NextResponse.json({ error: "No fairs found for this category" }, { status: 404 });
    }

    return NextResponse.json({ fairs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching fairs', error }, { status: 500 });
  }
}
