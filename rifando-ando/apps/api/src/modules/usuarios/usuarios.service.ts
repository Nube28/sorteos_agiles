import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { prisma } from '@rifando-ando/database'; // Tu importación personalizada
import { CreateUsuarioDto } from '../dtos/usuario/create-usuario.dto';
import { RolUsuario } from 'libs/shared/usuario/usuario.interface';

@Injectable()
export class UsuariosService {


    async create(createUsuarioDto: CreateUsuarioDto) {
        try {
            const { rol, ...userData } = createUsuarioDto;
            const existeUsuario = await prisma.usuario.findUnique({
                where: { nombreUsuario: userData.nombreUsuario }
            });

            if (existeUsuario) {
                throw new ConflictException(`El nombre de usuario '${userData.nombreUsuario}' ya está en uso.`);
            }

            return await prisma.$transaction(async (tx) => {

           
                const nuevoUsuario = await tx.usuario.create({
                    data: {
                        ...userData,
                        rol: rol, 
                    },
                });

                if (rol === RolUsuario.CLIENTE) {
                    await tx.cliente.create({
                        data: {
                            usuarioId: nuevoUsuario.id,
                        },
                    });
                } else if (rol === RolUsuario.ORGANIZADOR) {
                    await tx.organizador.create({
                        data: {
                            usuarioId: nuevoUsuario.id,
                        },
                    });
                }

                return nuevoUsuario;
            });

        } catch (error) {
            if (error instanceof ConflictException) throw error;

            if (error.code === 'P2002') {
                throw new ConflictException('El nombre de usuario ya existe.');
            }

            console.error("Error en createUsuario:", error);
            throw new InternalServerErrorException(`Error al crear usuario: ${error.message}`);
        }
    }


    async findOneByUsername(nombreUsuario: string) {
        return await prisma.usuario.findUnique({
            where: { nombreUsuario },
            // Incluimos los datos de los roles por si los necesitas en el token luego
            include: {
                Cliente: true,
                Organizador: true
            }
        });
    }

    async findOneById(id: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { id },
            include: {
                Cliente: true,
                Organizador: true
            }
        });

        if (!usuario) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        return usuario;
    }
}