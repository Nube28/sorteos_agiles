import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Module({
    imports: [],
    providers: [UsuariosService],
    exports: [UsuariosService],
})
export class UsuariosModule { }