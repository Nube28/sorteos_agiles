import { UserId } from '../../common/decorators/user.decorator';
import { NumeroService } from './numeros.service';
import { NumerosSchedulerService } from './numeros-scheduler.service';
import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CreateNumeroDto, ReservarNumerosDto, UpdateNumeroDto } from '../dtos';

@Controller('numeros')
export class NumeroController {
    constructor(private readonly numeroService: NumeroService, private readonly schedulerService: NumerosSchedulerService) { }

    @Post()
    createNumero(@Body() createNumeroDto: CreateNumeroDto) {
        const userId = createNumeroDto.clienteId;
        return this.numeroService.crearNumero(createNumeroDto, userId);
    }

    @Get(':id')
    getNumeros(@Param('id', ParseUUIDPipe) sorteoId: string) {
        return this.numeroService.getNumeros(sorteoId);
    }

    @Get(':id')
    getNumeroById(@Param('id', ParseUUIDPipe) id: string) {
        return this.numeroService.getNumeroById(id);
    }

    @Patch(':id')
    updateNumero(@Param('id', ParseUUIDPipe) id: string, @Body() updateNumeroDto: UpdateNumeroDto, @UserId() userId: string) {
        return this.numeroService.updateNumero(id, updateNumeroDto);
    }

    @Delete(':id')
    deleteSorteo(@Param('id', ParseUUIDPipe) id: string) {
        return this.numeroService.deleteNumero(id);
    }

    @Post('reservar-cantidad')
    reservarCantidad(@Body() dto: ReservarNumerosDto) {
        //Aqui esta hardcordeado por que no tenemos la logica para sacar el id de los user que estan en la pagina aun
        const userId = dto.clienteId || '1';
        return this.numeroService.reservarNumeros(dto, userId);
    }

    @Post('liberar-expirados')
    async liberarExpirados() {
        await this.schedulerService.liberarNumerosAhora();
        return { message: 'Proceso de liberación ejecutado' };
    }
}
