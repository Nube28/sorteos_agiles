import { Injectable } from '@nestjs/common';
import { prisma } from '@rifando-ando/database';

@Injectable()
export class OrganizadorService {
    async findOneByUserId(userId: string) {
        return await prisma.organizador.findFirst({
            where: {
                user: {
                    id: userId,
                },
            },
            include: { user: true },
        });
    }
}

    // async findOneByName(nombreUsuario: string) {
    //     return await prisma.organizador.findFirst({
    //         where: {
    //             user: {
    //                 nombreUsuario: nombreUsuario,
    //                 rol: 'ORGANIZADOR',
    //             },
    //         },
    //         include: { user: true }, 
    //     });
    // }