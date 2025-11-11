import { CreateNumeroDto, UpdateNumeroDto } from '@rifando-ando/dtos';
import { UserId } from '../../common/decorators/user.decorator';
import { NumeroService } from './numeros.service';
import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';

@Controller('numeros')
export class NumeroController {
    constructor(private readonly numeroService: NumeroService) { }

    @Post()
    createNumero(@Body() createNumeroDto: CreateNumeroDto) {
        const userId = createNumeroDto.clienteId;
        return this.numeroService.crearNumero(createNumeroDto, userId);
    }

    @Get(':id')
    getNumeros(@Param('id', ParseIntPipe) sorteoId: number) {
        return this.numeroService.getNumeros(sorteoId);
    }

    @Get(':id')
    getNumeroById(@Param('id', ParseIntPipe) id: number) {
        return this.numeroService.getNumeroById(id);
    }

    @Patch(':id')
    updateNumero(@Param('id', ParseIntPipe) id: number, @Body() updateNumeroDto: UpdateNumeroDto, @UserId() userId: number) {
        return this.numeroService.updateNumero(id, updateNumeroDto);
    }

    @Delete(':id')
    deleteSorteo(@Param('id', ParseIntPipe) id: number) {
        return this.numeroService.deleteNumero(id);
    }
}
