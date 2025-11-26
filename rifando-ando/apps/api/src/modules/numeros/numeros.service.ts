import { Injectable } from '@nestjs/common';
import { CreateNumeroDto, ReservarNumerosDto, UpdateNumeroDto} from '../dtos';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NumeroService {
    constructor(private prisma: PrismaService) {}

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
        // Desestructuramos 'numeros' (array) en lugar de cantidad
        const { sorteoId, numeros, fechaApartado } = dto;

        // 1. Obtener información del sorteo para validaciones
        const sorteo = await this.prisma.sorteo.findUnique({ where: { id: String(sorteoId) } });
        if (!sorteo) throw new Error('Sorteo no encontrado');

        // 2. Validar que los números estén dentro del rango permitido (1 - cantidadNumeros)
        const numerosFueraDeRango = numeros.filter(n => n < 1 || n > sorteo.cantidadNumeros);
        if (numerosFueraDeRango.length > 0) {
            throw new Error(`Los siguientes números no son válidos para este sorteo: ${numerosFueraDeRango.join(', ')}`);
        }

        // 3. Verificar concurrencia: ¿Alguno de los números solicitados YA está ocupado?
        // Usamos el operador 'in' de Prisma para buscar coincidencias exactas
        const ocupadosEncontrados = await this.prisma.numero.findMany({
            where: {
                sorteoId: String(sorteoId),
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
        await this.prisma.numero.createMany({
            data: numeros.map(pos => ({
                posicion: pos,
                fechaApartado: fechaIso,
                sorteoId: String(sorteoId),
                // Usamos el userId de la sesión, o el clienteId del DTO si es una operación administrativa
                clienteId: String(dto.clienteId || userId)
            }))
        });

        return { 
            message: 'Números apartados con éxito', 
            numeros: numeros 
        };
    }
}
