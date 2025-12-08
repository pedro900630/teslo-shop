import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const RawHeader = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const rawHeaders = request.rawHeaders;

    return !data ? rawHeaders : rawHeaders?.[data];
  },
);
