import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// De los mejores utilities i've ever seen
// get id from JWT token
// Así se evita enviar el id del usuario en el body o params
export const UserId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user?.userId;
    },
);