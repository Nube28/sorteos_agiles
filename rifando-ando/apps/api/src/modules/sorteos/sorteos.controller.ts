import { AuthGuard } from '@nestjs/passport';
import { UserId } from '../../common/decorators/user.decorator';
import { CreateSorteoDto, UpdateSorteoDto } from '../dtos';
import { SorteosService } from './sorteos.service';
import { Controller, Post, Body, Get, Param, Patch, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';

@Controller('sorteos')
export class SorteosController {
    constructor(private readonly sorteosService: SorteosService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    createSorteo(@Body() createSorteoDto: CreateSorteoDto, @UserId() userId: string) {
        return this.sorteosService.crearSorteo(createSorteoDto, userId);
    }

    @Get()
    getSorteos() {
        return this.sorteosService.getSorteos();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    getSorteoById(@Param('id', ParseUUIDPipe) id: string, @UserId() userId: string) {
        return this.sorteosService.getSorteoById(id, userId);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    updateSorteo(@Param('id', ParseUUIDPipe) id: string, @Body() updateSorteoDto: UpdateSorteoDto, @UserId() userId: string) {
        return this.sorteosService.updateSorteo(id, updateSorteoDto, userId);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    deleteSorteo(@Param('id', ParseUUIDPipe) id: string, @UserId() userId: string) {
        return this.sorteosService.deleteSorteo(id, userId);
    }
}
