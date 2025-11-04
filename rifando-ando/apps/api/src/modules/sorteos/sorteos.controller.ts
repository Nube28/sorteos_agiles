import { CreateSorteoDto, UpdateSorteoDto } from '@rifando-ando/dtos';
import { UserId } from '../../common/decorators/user.decorator';
import { SorteosService } from './sorteos.service';
import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';

@Controller('sorteos')
export class SorteosController {
    constructor(private readonly sorteosService: SorteosService) { }

    @Post()
    create(@Body() createSorteoDto: CreateSorteoDto, @UserId() userId: number) {
        return this.sorteosService.crearSorteo(createSorteoDto, userId);
    }

    @Get()
    findAll() {
        return this.sorteosService.getSorteos();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.sorteosService.getSorteoById(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateSorteoDto: UpdateSorteoDto, @UserId() userId: number) {
        return this.sorteosService.updateSorteo(id, updateSorteoDto, userId);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
        return this.sorteosService.deleteSorteo(id, userId);
    }
}
