import { verifyToken } from '@/utils/auth';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body)
  const { token, name, description, date, time, local, productTypes, vendors } = body;

  if (!token) {
    return NextResponse.json({ message: 'Token é obrigatório' }, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    if (user.role !== 'ORGANIZADOR') {
      return NextResponse.json({ message: 'Você não tem permissão para criar feiras' }, { status: 401 });
    }

    const newFair = await prisma.fair.create({
      data: {
        name,
        description,
        date: new Date(date),  
        time,
        local,
        productTypes,
        vendors: {
          connect: vendors.map((vendorId: number) => ({ userId: vendorId })),  
        },
        organizer: {
          connect: { userId: user.id }, 
        },
      },
    });

    console.log(newFair);

    return NextResponse.json({ success: "Feira criada com sucesso" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao processar token ou buscar usuário', error }, { status: 500 });
  }
}