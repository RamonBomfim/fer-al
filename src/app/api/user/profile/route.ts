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

    // Buscar usuário com base no ID extraído do token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        vendor: true,
        organizer: true
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    return NextResponse.json({ message: 'Erro ao processar token ou buscar usuário', error }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { token, fullName, email, password, role, storeName, whatSells, partnerNames, cnpj, keywords, cpfOrCnpj } = body;

    // Verificar o JWT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userData: any = verifyToken(token);
    console.log('User Data:', userData);
    if (!userData) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Atualizar dados do perfil
    const updatedUser = await prisma.user.update({
      where: { id: userData.userId },
      data: {
        fullName,
        email,
        ...(password && { password }), // Atualiza a senha somente se for fornecida
        ...(role !== "ORGANIZADOR" && { role }),
      },
    });

    // Caso seja vendedor ou organizador, atualize também seus dados
    if (role === 'VENDEDOR') {
      await prisma.vendor.upsert({
        where: { userId: updatedUser.id },
        update: { storeName, whatSells, partnerNames, cnpj, keywords },
        create: { userId: updatedUser.id, storeName, whatSells, partnerNames, cnpj, keywords },
      });
    }

    if (role === 'ORGANIZADOR') {
      await prisma.organizer.upsert({
        where: { userId: updatedUser.id },
        update: { cpfOrCnpj },
        create: { userId: updatedUser.id, cpfOrCnpj },
      });

      const user = await prisma.user.findUnique({
        where: { id: updatedUser.id },
        include: {
          approvalRequests: true
        }
      })

      if (user?.approvalRequests && user?.approvalRequests?.length > 0 && user?.approvalRequests[0].status === 'PENDING') {
        return NextResponse.json({ error: 'Usuário já possui uma aprovação pendente' }, { status: 400 });
      }

      if (user?.approvalRequests && user?.approvalRequests?.length > 0 && user?.approvalRequests[0].status !== "PENDING") {
        await prisma.approvalRequest.delete({
          where: { id: user?.approvalRequests[0].id }
        })

        await prisma.approvalRequest.create({
          data: {
            userId: updatedUser.id,
            requestedRole: role,
            cpfOrCnpj: cpfOrCnpj
          }
        })

        return NextResponse.json({ success: 'Nova solicitação enviada com sucesso' }, { status: 200 });
      }


      await prisma.approvalRequest.create({
        data: {
          userId: updatedUser.id,
          requestedRole: role,
          cpfOrCnpj: cpfOrCnpj
        }
      })

      return NextResponse.json({ success: 'Solicitação enviada com sucesso' }, { status: 200 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating profile' }, { status: 500 });
  }
}
