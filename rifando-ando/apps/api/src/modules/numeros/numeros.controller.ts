import { UserId } from '../../common/decorators/user.decorator';
import { NumeroService } from './numeros.service';
import { NumerosSchedulerService } from './numeros-scheduler.service';
import { Controller, Post, Body, Get, Param, Patch, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CreateNumeroDto, ReservarNumerosDto, UpdateNumeroDto } from '../dtos';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('numeros')
export class NumeroController {
    constructor(
        private readonly numeroService: NumeroService,
        private readonly schedulerService: NumerosSchedulerService
    ) { }

    @Post()
    createNumero(
        @Body() createNumeroDto: CreateNumeroDto,
        @UserId() userId: string
    ) {
        return this.numeroService.crearNumero(createNumeroDto, userId);
    }

    @Get('sorteo/:sorteoId')
    getNumeros(@Param('sorteoId', ParseUUIDPipe) sorteoId: string) {
        return this.numeroService.getNumeros(sorteoId);
    }

    @Get('detalle/:id')
    getNumeroById(@Param('id', ParseUUIDPipe) id: string) {
        return this.numeroService.getNumeroById(id);
    }

    @Patch(':id')
    updateNumero(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateNumeroDto: UpdateNumeroDto
    ) {
        return this.numeroService.updateNumero(id, updateNumeroDto);
    }

    @Delete(':id')
    deleteNumero(@Param('id', ParseUUIDPipe) id: string) {
        return this.numeroService.deleteNumero(id);
    }

    @Post('reservar-cantidad')
    reservarCantidad(
        @Body() dto: ReservarNumerosDto,
        @UserId() userId: string
    ) {
        return this.numeroService.reservarNumeros(dto, userId);
    }

    @Post('liberar-expirados')
    async liberarExpirados() {
        await this.schedulerService.liberarNumerosAhora();
        return { message: 'Proceso de liberación ejecutado' };
    }
}
