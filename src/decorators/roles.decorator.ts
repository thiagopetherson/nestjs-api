import { SetMetadata } from "@nestjs/common";
import { Role } from "src/enums/role.enums";

// Constante que será usada como chave para armazenar o metadado das roles
export const ROLES_KEY = 'roles';

/**
 * O decorator `Roles` permite definir um conjunto de permissões (roles)
 * necessárias para acessar determinada rota ou classe.
 * 
 * @param roles - Um array de permissões (roles) que são exigidas para a rota/classe
 * @returns - Uma chamada ao `SetMetadata`, que associa os metadados de roles à rota/classe
 */
export const Roles = (...roles: Role[]) => {
  // `SetMetadata` cria um metadado com a chave 'roles' e associa as roles passadas como argumento.
  // O metadado pode ser lido mais tarde pelo guard para realizar a verificação das permissões.
  return SetMetadata(ROLES_KEY, roles);
}
