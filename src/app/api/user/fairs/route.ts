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
    // Verificar e decodificar o token
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = verifyToken(token)

    const organizer = await prisma.organizer.findUnique({
      where: { userId: decoded.userId },
    })

    if (!organizer) {
      return NextResponse.json({ error: "Organizer not found" }, { status: 404 });
    }

    // Buscar usuário com base no ID extraído do token
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

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { token, id, name, description, date, time, local, productTypes, vendorIds } = body;

    if (!token || !id) {
      return NextResponse.json({ error: "Token and fair Id are required" }, { status: 400 });
    }

    // Verificar o JWT
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

    // Atualizar dados do perfil
    const updatedFair = await prisma.fair.update({
      where: { id },
      data: {
        name: name || fair.name,
        description: description || fair.description,
        date: date || fair.date,
        time: time || fair.time,
        local: local || fair.local,
        productTypes: productTypes || fair.productTypes,
        vendors: {
          set: vendorIds ? vendorIds.map((id: number) => ({ id })) : fair.vendors,
        },
      },
      include: {
        vendors: true,
      }
    });

    return NextResponse.json(updatedFair, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating profile' }, { status: 500 });
  }
}
