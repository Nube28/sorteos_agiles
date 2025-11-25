import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@rifando-ando/database';
import { OrganizadorService } from './organizador.service';
import { CreateSorteoDto } from '../dtos';

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

    async updateSorteo(id: number, datosDelFrontend: any, userId: number) {
        try {
            const sorteoExistente = await prisma.sorteo.findUnique({
                where: { id },
                select: { organizadorId: true }
            });

            if (!sorteoExistente) {
                throw new NotFoundException(`Sorteo con id ${id} no encontrado`);
            }

            const {
                id: idDelBody,
                organizador,
                organizadorId,
                numeros,
                ...datosLimpios
            } = datosDelFrontend;

            const datosParaActualizar = {
                ...datosLimpios,

                costo: Number(datosLimpios.costo),
                cantidadNumeros: Number(datosLimpios.cantidadNumeros),
                tiempoLimitePago: Number(datosLimpios.tiempoLimitePago),

                periodoInicioVenta: new Date(datosLimpios.periodoInicioVenta),
                periodoFinVenta: new Date(datosLimpios.periodoFinVenta),
                fechaSorteo: new Date(datosLimpios.fechaSorteo)
            };

            return await prisma.sorteo.update({
                where: { id: id },
                data: datosParaActualizar
            });

        } catch (error) {
            console.error("Error en updateSorteo:", error.message);
            throw new Error(`Error al actualizar sorteo: ${error.message}`);
        }
    }

    async deleteSorteo(id: number, userId: number) {
        return await prisma.sorteo.delete({
            where: { id },
        });
    }

}
