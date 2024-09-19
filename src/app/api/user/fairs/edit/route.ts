import { verifyToken } from '@/utils/auth';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { token, id } = await req.json();

  if (!token || !id) {
    return NextResponse.json({ error: "Token and fair Id are required" }, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const organizer = await prisma.organizer.findUnique({
      where: { userId: decoded.userId },
    });

    if (!organizer) {
      return NextResponse.json({ error: "Organizer not found" }, { status: 404 });
    }

    const fair = await prisma.fair.findUnique({
      where: { id },
      include: {
        vendors: true,
      }
    })

    if (!fair) {
      return NextResponse.json({ message: 'Feira não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ fair });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao processar token ou buscar feira', error }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { token, id, name, description, date, time, local, productTypes, status, vendors: vendorIds } = body;

    if (!token || !id) {
      return NextResponse.json({ error: "Token and fair Id are required" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userData: any = verifyToken(token);
    console.log('User Data:', userData);
    if (!userData || !userData.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const organizer = await prisma.organizer.findUnique({
      where: { userId: userData.userId },
    })

    if (!organizer) {
      return NextResponse.json({ error: "Organizer not found" }, { status: 404 });
    }

    const fair = await prisma.fair.findUnique({
      where: { id },
      include: {
        vendors: true,
      }
    })

    if (!fair || fair.organizerId !== organizer.userId) {
      return NextResponse.json({ error: "Fair not found or you are not the owner" }, { status: 403 });
    }

    await prisma.fair.update({
      where: { id },
      data: {
        name: name || fair.name,
        description: description || fair.description,
        date: date || fair.date,
        time: time || fair.time,
        local: local || fair.local,
        productTypes: productTypes || fair.productTypes,
        status: status || fair.status,
        vendors: {
          set: vendorIds ? vendorIds.map((id: number) => ({ id })) : fair.vendors,
        },
      },
      include: {
        vendors: true,
      }
    });

    return NextResponse.json({ success: "Fair updated." }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating profile' }, { status: 500 });
  }
}