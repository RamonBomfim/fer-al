// scripts/createSuperuser.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSuperuser() {
  const email = 'admin@feral.al.br'; // Defina o e-mail desejado
  const password = "Jd5h2t]&"; // Defina a senha desejada
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const superuser = await prisma.user.create({
      data: {
        fullName: 'admin',
        email,
        password: hashedPassword,
        role: 'SUPERUSER', // Role de superuser
      },
    });
    console.log('Superuser created:', superuser);
  } catch (error) {
    console.error('Error creating superuser:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperuser();
