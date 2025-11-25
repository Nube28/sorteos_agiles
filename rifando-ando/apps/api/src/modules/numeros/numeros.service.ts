import { Injectable } from '@nestjs/common';
import { prisma } from '@rifando-ando/database';
import { CreateNumeroDto, ReservarNumerosDto, UpdateNumeroDto} from '../dtos';

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
    async reservarNumeros(dto: ReservarNumerosDto, userId: number) {
        // Desestructuramos 'numeros' (array) en lugar de cantidad
        const { sorteoId, numeros, fechaApartado } = dto;

        // 1. Obtener información del sorteo para validaciones
        const sorteo = await prisma.sorteo.findUnique({ where: { id: sorteoId } });
        if (!sorteo) throw new Error('Sorteo no encontrado');

        // 2. Validar que los números estén dentro del rango permitido (1 - cantidadNumeros)
        const numerosFueraDeRango = numeros.filter(n => n < 1 || n > sorteo.cantidadNumeros);
        if (numerosFueraDeRango.length > 0) {
            throw new Error(`Los siguientes números no son válidos para este sorteo: ${numerosFueraDeRango.join(', ')}`);
        }

        // 3. Verificar concurrencia: ¿Alguno de los números solicitados YA está ocupado?
        // Usamos el operador 'in' de Prisma para buscar coincidencias exactas
        const ocupadosEncontrados = await prisma.numero.findMany({
            where: {
                sorteoId,
                posicion: { in: numeros }
            },
            select: { posicion: true }
        });

        if (ocupadosEncontrados.length > 0) {
            const listaOcupados = ocupadosEncontrados.map(n => n.posicion).join(', ');
            throw new Error(`Lo sentimos, los siguientes números ya fueron ganados por otra persona: ${listaOcupados}`);
        }

        // 4. Guardar masivamente los números seleccionados
        const fechaIso = new Date(fechaApartado).toISOString();

        // Usamos createMany para eficiencia
        await prisma.numero.createMany({
            data: numeros.map(pos => ({
                posicion: pos,
                fechaApartado: fechaIso,
                sorteoId: sorteoId,
                // Usamos el userId de la sesión, o el clienteId del DTO si es una operación administrativa
                clienteId: dto.clienteId || userId 
            }))
        });

        return { 
            message: 'Números apartados con éxito', 
            numeros: numeros 
        };
    }
}
