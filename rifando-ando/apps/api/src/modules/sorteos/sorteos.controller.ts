import { CreateSorteoDto, UpdateSorteoDto } from '@rifando-ando/dtos';
import { UserId } from '../../common/decorators/user.decorator';
import { SorteosService } from './sorteos.service';
import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';

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
    getSorteoById(@Param('id', ParseIntPipe) id: number) {
        return this.sorteosService.getSorteoById(id);
    }

    @Patch(':id')
    updateSorteo(@Param('id', ParseIntPipe) id: number, @Body() updateSorteoDto: UpdateSorteoDto, @UserId() userId: number) {
        return this.sorteosService.updateSorteo(id, updateSorteoDto, userId);
    }

    @Delete(':id')
    deleteSorteo(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
        return this.sorteosService.deleteSorteo(id, userId);
    }
}
