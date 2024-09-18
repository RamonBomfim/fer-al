import { hashPassword } from '@/utils/auth';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { fullName, email, password, confirmPassword, acceptTerms } = await req.json();

  if (!fullName || !email || !password || !confirmPassword || !acceptTerms) {
    return NextResponse.json({ message: 'Todos os campos são obrigatórios' }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ message: 'As senhas não coincidem' }, { status: 400 });
  }

  try {
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: 'VISITANTE',
      },
    });

    return NextResponse.json({ message: `Seja bem vindo(a), ${user.fullName}` }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao criar usuário' }, { status: 500 });
  }
}
