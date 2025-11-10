import { Injectable } from '@nestjs/common';
import { prisma } from '@rifando-ando/database';
import { CreateSorteoDto, UpdateSorteoDto } from '@rifando-ando/dtos';

@Injectable()
export class SorteosService {
    async crearSorteo(createSorteoDto: CreateSorteoDto, userId: number) {
        try {
            const {
                periodoInicioVenta,
                periodoFinVenta,
                fechaSorteo,
                organizadorId,
                ...restData
            } = createSorteoDto;

            return await prisma.sorteo.create({
                data: {
                    periodoInicioVenta: new Date(periodoInicioVenta),
                    periodoFinVenta: new Date(periodoFinVenta),
                    fechaSorteo: new Date(fechaSorteo),
                    organizadorId: organizadorId || userId,
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
