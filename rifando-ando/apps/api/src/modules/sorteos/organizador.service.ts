import { Injectable } from '@nestjs/common';
import { prisma } from '@rifando-ando/database';

@Injectable()
export class OrganizadorService {

    async findOneByName(nombreUsuario: string) {
        return await prisma.organizador.findFirst({
            where: {
                user: {
                    nombreUsuario: nombreUsuario,
                    rol: 'ORGANIZADOR',
                },
            },
            include: { user: true }, 
        });
    }
}
