import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";

// No filter estamos pegando o parâmetro que foi passado
export const User = createParamDecorator((filter: string, context: ExecutionContext) => {

  // No context, vamos extrair o request, que foi passado como contexto (meio que como parâmetro)
  const request = context.switchToHttp().getRequest();

  // Verificando se a propriedade .user existe no request
  if (request.user) {

    if (filter) {
      return request.user[filter];
    } else {
      return request.user;
    }

  } else {
    throw new NotFoundException("Usuário não encontrado no Request. Use o AuthGuard para obter o usuário.")
  } 
});