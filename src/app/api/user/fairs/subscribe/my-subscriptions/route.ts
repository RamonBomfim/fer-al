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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = verifyToken(token);

    const vendor = await prisma.vendor.findUnique({
      where: { userId: decoded.userId },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const mySubscriptions = await prisma.fairVendor.findMany({
      where: { vendorId: vendor.userId },
      include: {
        fair: true,
      },
    });

    if (!mySubscriptions) {
      return NextResponse.json(
        { message: "Você ainda não tem feiras criadas." },
        { status: 404 }
      );
    }

    const fairs = mySubscriptions.map((subscription) => (
      subscription.fair
    ))

    return NextResponse.json({ subscriptions: { fairId: mySubscriptions[0].fairId, vendorId: mySubscriptions[0].vendorId, fairs } });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao processar token ou buscar usuário", error },
      { status: 500 }
    );
  }
}
