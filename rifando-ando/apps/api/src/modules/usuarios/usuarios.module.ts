import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    imports: [],
    providers: [UsuariosService, PrismaService],
    exports: [UsuariosService],
})
export class UsuariosModule { }