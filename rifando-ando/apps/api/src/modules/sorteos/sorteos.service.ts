import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { OrganizadorService } from './organizador.service';
import { CreateSorteoDto } from '../dtos';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SorteosService {
    constructor(
        private prisma: PrismaService,
        private organizadorService: OrganizadorService
    ) { }

    async crearSorteo(createSorteoDto: CreateSorteoDto, userId: string) {
        const {
            periodoInicioVenta,
            periodoFinVenta,
            fechaSorteo,
            cantidadNumeros,
            ...restData
        } = createSorteoDto;

        // Buscar organizador por userId, no por nombre
        const organizador = await this.organizadorService.findOneByUserId(userId);

        if (!organizador) {
            throw new NotFoundException(`No se encontró un organizador asociado a este usuario.`);
        }

        const totalNumeros = Number(cantidadNumeros);

        return this.prisma.sorteo.create({
            data: {
                periodoInicioVenta: new Date(periodoInicioVenta),
                periodoFinVenta: new Date(periodoFinVenta),
                fechaSorteo: new Date(fechaSorteo),
                organizador: {
                    connect: { id: organizador.id }
                },
                cantidadNumeros: totalNumeros,
                ...(() => {
                    const { organizadorId, ...data } = restData;
                    return data;
                })(),
            },
        });
    }


    async getSorteos() {
        return this.prisma.sorteo.findMany({
            include: { organizador: true },
        });
    }

    async getSorteoById(id: string, userId: string) {
        const sorteo = await this.prisma.sorteo.findUnique({
            where: { id },
            include: { organizador: true },
        });

        if (!sorteo) throw new NotFoundException(`Sorteo con id ${id} no encontrado`);

        return sorteo;
    }

    async updateSorteo(id: string, datosDelFrontend: any, userId: string) {
        const sorteoExistente = await this.prisma.sorteo.findUnique({
            where: { id },
            select: { organizadorId: true }
        });

        if (!sorteoExistente) throw new NotFoundException(`Sorteo con id ${id} no encontrado`);

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
            fechaSorteo: new Date(datosLimpios.fechaSorteo),
        };

        return this.prisma.sorteo.update({
            where: { id },
            data: datosParaActualizar
        });
    }

    async deleteSorteo(id: string, userId: string) {
        // 1. Buscamos el sorteo
        const sorteo = await this.prisma.sorteo.findUnique({
            where: { id },
            select: { organizadorId: true }
        });

        if (!sorteo) throw new NotFoundException(`Sorteo con id ${id} no encontrado`);


        const organizadorDelUsuario = await this.organizadorService.findOneByUserId(userId);

        if (!organizadorDelUsuario) {
            throw new ForbiddenException('No se encontró un perfil de organizador para este usuario');
        }

      
        if (sorteo.organizadorId !== organizadorDelUsuario.id) {
            throw new ForbiddenException('No tienes permisos para eliminar este sorteo');
        }

        return this.prisma.sorteo.delete({ where: { id } });
    }
}
