import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// No _data iremos receber nada. Vamos extrair o id do context.
export const ParamId = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  // Ali, do context, poderíamos pode exemplo obter o request, o response, etc...

  return Number(context.switchToHttp().getRequest().params.id);

});