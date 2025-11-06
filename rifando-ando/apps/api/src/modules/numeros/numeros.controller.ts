import { CreateNumeroDto, UpdateNumeroDto } from '@rifando-ando/dtos';
import { UserId } from '../../common/decorators/user.decorator';
import { NumeroService } from './numeros.service';
import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';

@Controller('numeros')
export class NumeroController {
    constructor(private readonly numeroService: NumeroService) { }

    @Post()
    createNumero(@Body() CreateNumeroDto: CreateNumeroDto, @UserId() userId: number, sorteoId: number) {
        return this.numeroService.crearNumero(CreateNumeroDto, userId, sorteoId);
    }

    @Get()
    getNumeros() {
        return this.numeroService.getNumeros();
    }

    @Get(':id')
    getNumerosById(@Param('id', ParseIntPipe) id: number) {
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
