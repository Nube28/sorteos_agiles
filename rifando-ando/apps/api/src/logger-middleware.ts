import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Este es un middleware que sirve como logger, cada que se hace una petición la va a imprimir
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, headers, body } = req;
        const origin = headers.origin;

        if (method === 'OPTIONS') {
            this.logger.debug(`PREFLIGHT ${originalUrl} from ${origin}`);
        } else {
            this.logger.debug(`${method} ${originalUrl} - body: ${JSON.stringify(body)}`);
        }

        next();
    }
}