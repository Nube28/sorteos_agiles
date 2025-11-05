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
                tiempoLimitePago, 
                ...restData 
            } = createSorteoDto;

            // Recibe strings, los convierte al necesario por prisma
            return await prisma.sorteo.create({
                data: {
                    ...restData,
                    periodoInicioVenta: new Date(periodoInicioVenta).toISOString(),
                    periodoFinVenta: new Date(periodoFinVenta).toISOString(),
                    fechaSorteo: new Date(fechaSorteo).toISOString(),
                    tiempoLimitePago: new Date(tiempoLimitePago).toISOString(),
                    organizadorId: userId,
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
