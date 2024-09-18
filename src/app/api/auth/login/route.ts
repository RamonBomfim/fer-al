import { comparePassword, generateToken } from '@/utils/auth';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email e senha são obrigatórios' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    const token = generateToken(user.id);

    return NextResponse.json({
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao fazer login' }, { status: 500 });
  }
}
