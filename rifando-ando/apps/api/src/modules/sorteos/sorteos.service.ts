import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, Rol } from '@rifando-ando/database';
import { CreateSorteoDto, UpdateSorteoDto } from '@rifando-ando/dtos';
import { OrganizadorService } from './organizador.service'; // Importa tu nuevo servicio
@Injectable()
export class SorteosService {
    constructor(
        private organizadorService: OrganizadorService
    ) { }
    async crearSorteo(createSorteoDto: CreateSorteoDto) {
        try {
            const {
                periodoInicioVenta,
                periodoFinVenta,
                fechaSorteo,
                nombreOrganizador,
                cantidadNumeros,
                ...restData
            } = createSorteoDto;

            const organizador = await this.organizadorService.findOneByName(nombreOrganizador);

            if (!organizador) {
                throw new NotFoundException(`No se encontró un organizador con el usuario: ${nombreOrganizador}`);
            }
            const totalNumeros = Number(cantidadNumeros);
            return await prisma.sorteo.create({
                data: {
                    periodoInicioVenta: new Date(periodoInicioVenta),
                    periodoFinVenta: new Date(periodoFinVenta),
                    fechaSorteo: new Date(fechaSorteo),
                    organizador: {
                        connect: { id: organizador.id }
                    },
                    cantidadNumeros: totalNumeros,
                    ...restData,
                },
            });
        } catch (error) {
            throw new Error(`Error al crear sorteo: ${error.message}`);
        }
    }

    async getSorteos() {
        return await prisma.sorteo.findMany({
            include: {
                organizador: true,
            },
        });
    }

    async getSorteoById(id: number) {
        return await prisma.sorteo.findUnique({
            where: { id },
            include: {
                organizador: true,
            },
        });
    }
    
    async updateSorteo(id: number, updateSorteoDto: Partial<UpdateSorteoDto>, userId: number) {
        try {
            await this.getSorteoById(id);
            return await prisma.sorteo.update({
                where: { id }, data: { ...updateSorteoDto },
            });
        } catch (error) {
            throw new Error(`Error al actualizar sorteo: ${error.message}`);
        }
    }

    async deleteSorteo(id: number, userId: number) {
        return await prisma.sorteo.delete({
            where: { id },
        });
    }
}
