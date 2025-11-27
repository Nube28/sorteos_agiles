import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Usuario, Rol } from '@prisma/client';

export type SafeUser = {
    id: string;
    nombreUsuario: string;
    nombre: string;
    apellidos: string;
    rol: Rol;
    clienteId?: string;
    organizadorId?: string;
};

@Injectable()
export class UsuariosService {
    constructor(private prisma: PrismaService) { }

    async findByNombreUsuario(nombreUsuario: string): Promise<Usuario | null> {
        return this.prisma.usuario.findUnique({ where: { nombreUsuario } });
    }

    async findById(id: string): Promise<Usuario | null> {
        return this.prisma.usuario.findUnique({
            where: { id },
            include: {
                Cliente: true,
                Organizador: true,
            }
        });
    }

    async create(
        nombreUsuario: string,
        passwordHash: string,
        nombre: string,
        apellidos: string,
        rol: Rol
    ): Promise<Usuario> {
        return await this.prisma.$transaction(async (tx) => {
            const usuario = await tx.usuario.create({
                data: {
                    nombreUsuario,
                    contrasenia: passwordHash,
                    nombre,
                    apellidos,
                    rol,
                },
            });

            // crea cliente u organizador según el rol
            if (rol === Rol.CLIENTE) {
                await tx.cliente.create({
                    data: {
                        usuarioId: usuario.id
                    }
                });
            } else if (rol === Rol.ORGANIZADOR) {
                await tx.organizador.create({
                    data: {
                        usuarioId: usuario.id
                    }
                });
            }

            return usuario;
        });
    }

    toSafeUser(user: Usuario & { Cliente?: any; Organizador?: any }): SafeUser {
        return {
            id: user.id,
            nombreUsuario: user.nombreUsuario,
            nombre: user.nombre,
            apellidos: user.apellidos,
            rol: user.rol,
            clienteId: user.Cliente?.id,
            organizadorId: user.Organizador?.id,
        };
    }
}
