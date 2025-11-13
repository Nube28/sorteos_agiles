import { CreateNumeroDto, UpdateNumeroDto, ReservarCantidadDto } from '@rifando-ando/dtos';
import { UserId } from '../../common/decorators/user.decorator';
import { NumeroService } from './numeros.service';
import { NumerosSchedulerService } from './numeros-scheduler.service';
import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';

@Controller('numeros')
export class NumeroController {
    constructor(private readonly numeroService: NumeroService, private readonly schedulerService: NumerosSchedulerService) { }

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

    @Post('reservar-cantidad')
    reservarCantidad(@Body() dto: ReservarCantidadDto) {
        //Aqui esta hardcordeado por que no tenemos la logica para sacar el id de los user que estan en la pagina aun
        const userId = dto.clienteId || 1;
        return this.numeroService.reservarNumerosAleatorios(dto, userId);
    }

    @Post('liberar-expirados')
    async liberarExpirados() {
        await this.schedulerService.liberarNumerosAhora();
        return { message: 'Proceso de liberación ejecutado' };
    }
}
