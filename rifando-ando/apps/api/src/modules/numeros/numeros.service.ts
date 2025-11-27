import { Injectable } from '@nestjs/common';
import { CreateNumeroDto, ReservarNumerosDto, UpdateNumeroDto } from '../dtos';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NumeroService {
    constructor(private prisma: PrismaService) { }

    async crearNumero(createNumeroDto: CreateNumeroDto, userId: string) {
        try {
            const {
                fechaApartado,
                ...restData
            } = createNumeroDto;

            // Recibe strings, los convierte al necesario por prisma
            return await this.prisma.numero.create({
                data: {
                    ...restData,
                    fechaApartado: new Date(fechaApartado).toISOString(),
                    clienteId: userId,
                    sorteoId: String(restData.sorteoId)
                },
            });
        } catch (error) {
            throw new Error(`Error al crear sorteo: ${error.message}`);
        }
    }

    async getNumeros(sorteoId: string) {
        return await this.prisma.numero.findMany({
            where: {
                sorteoId: sorteoId,
            },
            include: {
                cliente: true,
                sorteo: true,
            },
        });
    }

    async getNumeroById(id: string) {
        return await this.prisma.numero.findUnique({
            where: { id },
            include: {
                cliente: true,
                sorteo: true,
            },
        });
    }

    async updateNumero(id: string, UpdateNumeroDto: Partial<UpdateNumeroDto>,) {
        try {
            await this.getNumeroById(id);
            return await this.prisma.numero.update({
                where: { id }, data: { ...UpdateNumeroDto },
            });
        } catch (error) {
            throw new Error(`Error al actualizar numero: ${error.message}`);
        }
    }

    async deleteNumero(id: string) {
        return await this.prisma.numero.delete({
            where: { id },
        });
    }

    async reservarNumeros(dto: ReservarNumerosDto, userId: string) {
        const { sorteoId, numeros, fechaApartado } = dto;

        const sorteo = await this.prisma.sorteo.findUnique({
            where: { id: sorteoId }
        });
        if (!sorteo) throw new Error('Sorteo no encontrado');

        // Validar rango de números
        const fueraDeRango = numeros.filter(n => n < 1 || n > sorteo.cantidadNumeros);
        if (fueraDeRango.length > 0) {
            throw new Error(
                `Los siguientes números están fuera del rango permitido: ${fueraDeRango.join(', ')}`
            );
        }

        // Obtener el cliente asociado al usuario autenticado
        const cliente = await this.prisma.cliente.findUnique({
            where: { usuarioId: userId }
        });

        if (!cliente) {
            throw new Error('No existe un cliente asociado a este usuario');
        }

        // Verificar concurrencia
        const ocupados = await this.prisma.numero.findMany({
            where: {
                sorteoId,
                posicion: { in: numeros }
            },
            select: { posicion: true }
        });

        if (ocupados.length > 0) {
            const lista = ocupados.map(n => n.posicion).join(', ');
            throw new Error(`Los siguientes números ya están ocupados: ${lista}`);
        }

        // Crear masivamente los números
        await this.prisma.numero.createMany({
            data: numeros.map(pos => ({
                posicion: pos,
                fechaApartado: new Date(fechaApartado),
                sorteoId,
                clienteId: cliente.id
            }))
        });

        return {
            message: 'Números apartados con éxito',
            numeros
        };
    }

}
