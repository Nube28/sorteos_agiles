import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';

// Singleton
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// nueva instancia si no existe
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// En desarrollo, guardar la instancia globalmente para reutilizarla
if (process.env['NODE_ENV'] !== 'production') {
    globalForPrisma.prisma = prisma;
}

// cierre  de la conexión
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

