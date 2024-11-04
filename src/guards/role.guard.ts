import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enums";

@Injectable()
export class RoleGuard implements CanActivate {
  
  constructor(private readonly reflector: Reflector) {}

  /**
   * Método que determina se a rota pode ser acessada com base nas roles (permissões) do usuário.
   * 
   * @param context - O contexto da execução que contém informações sobre a requisição, rota, etc.
   * @returns - Retorna `true` se o usuário tiver permissão, ou `false` caso contrário.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Recupera as roles exigidas da rota ou classe usando o Reflector. O getAllAndOverride
    // permite verificar tanto o manipulador de rota (context.getHandler()) quanto a classe (context.getClass()).
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), 
      context.getClass()
    ]);

    // Se nenhuma role for exigida, a rota é acessível sem restrições, então retorna `true`.
    if (!requiredRoles) {
      return true;
    }

    // Obtém o usuário autenticado a partir da requisição HTTP.
    const { user } = context.switchToHttp().getRequest();      

    // Verificando se a refra é igual a regra do usuário
    const rolesFiltered = requiredRoles.filter(role => role === user.role)
    // Se ele tiver algumas das regras, então dará true. Do contrário, é false
    return rolesFiltered.length > 0;
    
    // Aqui você adicionaria a lógica de validação das roles do usuário
    // Exemplo: verificar se o usuário tem uma role que corresponda às requiredRoles
    // return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
