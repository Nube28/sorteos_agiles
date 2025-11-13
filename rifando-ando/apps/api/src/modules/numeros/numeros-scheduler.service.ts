import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { prisma } from '@rifando-ando/database';

@Injectable()
export class NumerosSchedulerService {
  private readonly logger = new Logger(NumerosSchedulerService.name);

  // Se ejecuta cada 30 segundos (es para testing, chill) 
  @Cron(CronExpression.EVERY_30_SECONDS)
  async liberarNumerosExpirados() {
    this.logger.debug('Verificando números apartados expirados...');

    try {
      // Numeros que: No han sido pagados y estén apartados por alguien
      const numerosApartados = await prisma.numero.findMany({
        where: {
          pagosId: null,
          clienteId: { not: null },
        },
        include: {
          sorteo: true, // agarra el tiempoLimitePago del sorteo
        },
      });

      let liberados = 0;

      for (const numero of numerosApartados) {
        const { fechaApartado, sorteo } = numero;
        const tiempoLimite = sorteo.tiempoLimitePago; // días

        // calcular si ya expiró
        const fechaExpiracion = new Date(fechaApartado);
        fechaExpiracion.setDate(fechaExpiracion.getDate() + tiempoLimite);
        const ahora = new Date();

        // Eliminar número (se setea nulo)
        if (ahora > fechaExpiracion) {
          await prisma.numero.delete({
            where: { id: numero.id },
          });

          // solo para logs, luego se quita
          liberados++;
          this.logger.log(
            `Número ${numero.posicion} del sorteo ${sorteo.id} liberado (expiró)`
          );
        }
      }

      if (liberados > 0) {
        this.logger.log(`Total de números liberados: ${liberados}`);
      } else {
        this.logger.debug('No hay números expirados en este momento');
      }
    } catch (error) {
      this.logger.error('Error al liberar números expirados:', error.message);
    }
  }

  // Esto es para liberarlos manual sin el cron, solo para testing, dudo que lo vayamos a hacer manual
  async liberarNumerosAhora() {
    this.logger.log('Ejecución manual de liberación de números');
    return this.liberarNumerosExpirados();
  }
}