import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Organizador
  const organizador = await prisma.usuario.upsert({
    where: { nombreUsuario: 'admin' },
    update: {},
    create: {
      nombre: 'Admin',
      apellidos: 'Sistema',
      nombreUsuario: 'admin',
      contrasenia: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // "password"
      rol: 'ORGANIZADOR',
    },
  });

  console.log('Organizador creado:', organizador);

  // Organizador vinculado a usuario
  const organizadorData = await prisma.organizador.upsert({
    where: { usuarioId: organizador.id },
    update: {},
    create: {
      usuarioId: organizador.id,
    },
  });

  console.log('Organizador vinculado a usuario creado:', organizadorData);

  const cliente = await prisma.usuario.upsert({
    where: { nombreUsuario: 'cliente' },
    update: {},
    create: {
      nombre: 'Cliente',
      apellidos: 'Prueba',
      nombreUsuario: 'cliente',
      contrasenia: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // "password"
      rol: 'CLIENTE',
    },
  });

  console.log('Cliente creado:', cliente);

  const clienteData = await prisma.cliente.upsert({
    where: { usuarioId: cliente.id },
    update: {},
    create: {
      usuarioId: cliente.id,
    },
  });

  console.log('Cliente vinculado a usuario creado:', clienteData);
  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    (globalThis as any).process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
