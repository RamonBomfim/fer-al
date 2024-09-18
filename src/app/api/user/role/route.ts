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

    // Buscar usuário com base no ID extraído do token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ user: user.role });

  } catch (error) {
    return NextResponse.json({ message: 'Erro ao processar token ou buscar usuário', error }, { status: 500 });
  }
}