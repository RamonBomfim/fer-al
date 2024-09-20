// src/api/fair/subscribe.ts
import { verifyToken } from '@/utils/auth'; // Supondo que você tenha uma função de verificação de token
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { token, fairId } = await req.json();

    if (!token) {
      return NextResponse.json({ message: 'Token é obrigatório' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: 'Permissão negada.' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (user?.role !== 'VENDEDOR') {
      return NextResponse.json({ message: 'Permissão negada. Apenas vendedores podem se inscrever' }, { status: 403 });
    }

    // Verificar se a feira existe
    const fair = await prisma.fair.findUnique({
      where: { id: fairId },
      include: { vendors: true },
    });

    if (!fair) {
      return NextResponse.json({ message: 'Feira não encontrada' }, { status: 404 });
    }

    // Verificar se o vendedor já está inscrito
    const alreadySubscribed = await prisma.fairVendor.findUnique({
      where: {
        fairId_vendorId: {
          fairId,
          vendorId: decoded.userId,
        },
      },
    });

    if (alreadySubscribed) {
      return NextResponse.json({ message: 'Você já está inscrito nesta feira.' }, { status: 400 });
    }

    // Inscrever o vendedor na feira
    await prisma.fairVendor.create({
      data: {
        fairId,
        vendorId: decoded.userId,
      },
    });

    return NextResponse.json({ message: 'Inscrição realizada com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error('Error subscribing vendor to fair:', error);
    return NextResponse.json({ message: 'Erro ao realizar inscrição.' }, { status: 500 });
  }
}
