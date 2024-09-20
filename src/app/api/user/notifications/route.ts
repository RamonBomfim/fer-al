import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, type, fairId, productTypes, location } = body;

  // Verifica se todos os dados obrigatórios foram enviados
  if (!userId || !type) {
    return NextResponse.json(
      { message: 'Campos obrigatórios não preenchidos' },
      { status: 400 }
    );
  }

  try {
    // Cria uma nova inscrição
    const newSubscription = await prisma.notificationSubscription.create({
      data: {
        userId,
        type,
        fairId,
        productTypes,
        location,
      },
    });

    return NextResponse.json({ success: 'Inscrição realizada com sucesso', subscription: newSubscription }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification subscription:', error);
    return NextResponse.json(
      { message: 'Erro ao criar inscrição', error },
      { status: 500 }
    );
  }
}
