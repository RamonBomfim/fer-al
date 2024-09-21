import { verifyToken } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json(
      { message: "Token é obrigatório" },
      { status: 400 }
    );
  }

  try {
    // Verificar e decodificar o token
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = verifyToken(token);

    // Buscar usuário com base no ID extraído do token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    console.log("User:", user);

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    if (user.role === "SUPERUSER") {
      const approvals = await prisma.user.findMany({
        where: { id: { not: user.id }, approvalRequests: { some: {} } },
        include: {
          approvalRequests: true,
        },
      });

      return NextResponse.json({
        approvals: approvals.map((approval) => ({
          id: approval.id,
          fullName: approval.fullName,
          email: approval.email,
          role: approval.role,
          approvalRequests: approval.approvalRequests.map((approval) => ({
            id: approval.id,
            userId: approval.id,
            requestedRole: approval.requestedRole,
            cpfOrCnpj: approval.cpfOrCnpj,
            status: approval.status,
          })),
        })),
      });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao processar token ou buscar usuário", error },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { token, status, id, userId, cpfOrCnpj } = body;


    // Verificar o JWT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userData: any = verifyToken(token);
    console.log("User Data:", userData);
    if (!userData) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await prisma.approvalRequest.update({
      where: { id: id },
      data: {
        status: status.toLowerCase() === "approve" ? "APPROVED" : "REJECTED",
      },
    });

    await prisma.organizer.update({
      where: { userId: userId },
      data: {
        cpfOrCnpj,
      },
    })

    // Caso seja vendedor ou organizador, atualize também seus dados
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: status === "approve" ? "ORGANIZADOR" : "VISITANTE",
      },
    });

    return NextResponse.json({ success: "Usuário aprovado como novo Organizador"}, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating profile" },
      { status: 500 }
    );
  }
}
