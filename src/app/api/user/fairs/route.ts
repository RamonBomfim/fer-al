import { verifyToken } from '@/utils/auth';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ message: 'Token é obrigatório' }, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = verifyToken(token)

    const organizer = await prisma.organizer.findUnique({
      where: { userId: decoded.userId },
    })

    if (!organizer) {
      return NextResponse.json({ error: "Organizer not found" }, { status: 404 });
    }

    const myFairs = await prisma.fair.findMany({
      where: { organizerId: organizer.userId },
      include: {
        vendors: true,
      },
    });

    if (!myFairs) {
      return NextResponse.json({ message: 'Você ainda não tem feiras criadas.' }, { status: 404 });
    }

    return NextResponse.json({ myFairs });

  } catch (error) {
    return NextResponse.json({ message: 'Erro ao processar token ou buscar usuário', error }, { status: 500 });
  }
}
