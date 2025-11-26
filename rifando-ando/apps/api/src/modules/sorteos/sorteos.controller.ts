import { UserId } from '../../common/decorators/user.decorator';
import { CreateSorteoDto, UpdateSorteoDto } from '../dtos';
import { SorteosService } from './sorteos.service';
import { Controller, Post, Body, Get, Param, Patch, Delete, ParseUUIDPipe } from '@nestjs/common';

@Controller('sorteos')
export class SorteosController {
    constructor(private readonly sorteosService: SorteosService) { }

    @Post()
    createSorteo(@Body() createSorteoDto: CreateSorteoDto) {
        // cuando metamos jwt plebes hay cambiar esto a:
        // createSorteo(@Body() createSorteoDto: CreateSorteoDto, @UserId() userId: number)
        // Por ahora usa organizadorId del body o usa un valor hardcodeado
        return this.sorteosService.crearSorteo(createSorteoDto);
    }

    @Get()
    getSorteos() {
        return this.sorteosService.getSorteos();
    }

    @Get(':id')
    getSorteoById(@Param('id', ParseUUIDPipe) id: string) {
        return this.sorteosService.getSorteoById(id);
    }

    @Patch(':id')
    updateSorteo(@Param('id', ParseUUIDPipe) id: string, @Body() updateSorteoDto: UpdateSorteoDto, /*@UserId() userId: number*/) {
        const userId_temporal = '1'; // Por el momento ya que no tenemos configurado el jwt
        return this.sorteosService.updateSorteo(id, updateSorteoDto, userId_temporal);
    }

    @Delete(':id')
    deleteSorteo(@Param('id', ParseUUIDPipe) id: string, @UserId() userId: string) {
        return this.sorteosService.deleteSorteo(id, userId);
    }
}
