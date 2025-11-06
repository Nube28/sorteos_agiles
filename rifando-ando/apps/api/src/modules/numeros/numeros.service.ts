import { Injectable } from '@nestjs/common';
import { prisma } from '@rifando-ando/database';
import { CreateNumeroDto, UpdateNumeroDto } from '@rifando-ando/dtos';

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

    async getNumeros() {
        return await prisma.numero.findMany({
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
}
