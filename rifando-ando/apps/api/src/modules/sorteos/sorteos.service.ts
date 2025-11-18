import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, Rol } from '@rifando-ando/database';
import { CreateSorteoDto, UpdateSorteoDto } from '@rifando-ando/dtos';
import { OrganizadorService } from './organizador.service'; // Importa tu nuevo servicio
import { error } from 'console';
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
            // --- Verificación de Permisos (Recomendado) ---
            const sorteoExistente = await prisma.sorteo.findUnique({
                where: { id },
                select: { organizadorId: true }
            });

            if (!sorteoExistente) {
                throw new NotFoundException(`Sorteo con id ${id} no encontrado`);
            }
           


            // --- PASO 1: Limpiar el objeto ---
            // Quitamos los campos que Prisma no acepta en 'data'
            const {
                id: idDelBody,
                organizador,
                organizadorId,
                numeros,
                ...datosLimpios // El resto (nombre, costo, fechas en string) queda aquí
            } = datosDelFrontend;


            // --- PASO 2: Convertir los tipos ---
            // Prisma necesita tipos 'Date' y 'Number', no 'string'
            const datosParaActualizar = {
                ...datosLimpios, // Empezamos con los datos limpios

                // Sobrescribimos los campos numéricos
                costo: Number(datosLimpios.costo),
                cantidadNumeros: Number(datosLimpios.cantidadNumeros),
                tiempoLimitePago: Number(datosLimpios.tiempoLimitePago),

                // Sobrescribimos los campos de fecha
                periodoInicioVenta: new Date(datosLimpios.periodoInicioVenta),
                periodoFinVenta: new Date(datosLimpios.periodoFinVenta),
                fechaSorteo: new Date(datosLimpios.fechaSorteo)
            };


            // --- PASO 3: Actualizar en Prisma ---
            return await prisma.sorteo.update({
                where: { id: id },
                data: datosParaActualizar // Pasamos el objeto limpio Y convertido
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
