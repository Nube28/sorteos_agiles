import { Injectable } from '@nestjs/common';
import { prisma } from '@rifando-ando/database';
import { CreateNumeroDto, UpdateNumeroDto ,ReservarCantidadDto} from '@rifando-ando/dtos';

@Injectable()
export class NumeroService {
    async crearNumero(createNumeroDto: CreateNumeroDto, userId: number) {
        try {
            const {
                fechaApartado,
                ...restData
            } = createNumeroDto;

            // Recibe strings, los convierte al necesario por prisma
            return await prisma.numero.create({
                data: {
                    ...restData,
                    fechaApartado: new Date(fechaApartado).toISOString(),
                    clienteId: userId
                },
            });
        } catch (error) {
            throw new Error(`Error al crear sorteo: ${error.message}`);
        }
    }

    async getNumeros(sorteoId: number) {
        return await prisma.numero.findMany({
            where: {
                sorteoId: sorteoId,
            },
            include: {
                cliente: true,
                sorteo: true,
            },
        });
    }

    async getNumeroById(id: number) {
        return await prisma.numero.findUnique({
            where: { id },
            include: {
                cliente: true,
                sorteo: true,
            },
        });
    }

    async updateNumero(id: number, UpdateNumeroDto: Partial<UpdateNumeroDto>,) {
        try {
            await this.getNumeroById(id);
            return await prisma.numero.update({
                where: { id }, data: { ...UpdateNumeroDto },
            });
        } catch (error) {
            throw new Error(`Error al actualizar numero: ${error.message}`);
        }
    }

    async deleteNumero(id: number,) {
        return await prisma.numero.delete({
            where: { id },
        });
    }
    async reservarNumerosAleatorios(dto: ReservarCantidadDto, userId: number) {
        const { sorteoId, cantidad, fechaApartado } = dto;

        // 1. Obtener información del sorteo para saber el límite
        const sorteo = await prisma.sorteo.findUnique({ where: { id: sorteoId } });
        if (!sorteo) throw new Error('Sorteo no encontrado');

        // 2. Obtener los números que YA están ocupados
        const numerosOcupados = await prisma.numero.findMany({
            where: { sorteoId },
            select: { posicion: true }
        });

        const setOcupados = new Set(numerosOcupados.map(n => n.posicion));

        // 3. Calcular cuáles están libres (del 1 al cantidadNumeros)
        const disponibles: number[] = [];
        for (let i = 1; i <= sorteo.cantidadNumeros; i++) {
            if (!setOcupados.has(i)) {
                disponibles.push(i);
            }
        }

        if (disponibles.length < cantidad) {
            throw new Error(`Solo quedan ${disponibles.length} números disponibles.`);
        }

        // 4. Seleccionar 'cantidad' números aleatorios de los disponibles
        for (let i = disponibles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [disponibles[i], disponibles[j]] = [disponibles[j], disponibles[i]];
        }

        const seleccionados = disponibles.slice(0, cantidad);

        // 5. Guardar masivamente (Transacción para atomicidad)
        const fechaIso = new Date(fechaApartado).toISOString();

        await prisma.numero.createMany({
            data: seleccionados.map(pos => ({
                posicion: pos,
                fechaApartado: fechaIso,
                sorteoId: sorteoId,
                clienteId: userId
            }))
        });

        return { message: 'Números apartados con éxito', numeros: seleccionados };
    }
}
