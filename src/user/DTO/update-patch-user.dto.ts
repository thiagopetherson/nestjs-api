import { CreateUserDTO } from "./create-user.dto";
import { PartialType } from '@nestjs/mapped-types'; // Importando o PartialType

// Quando você extende um DTO, as regras aplicadas naquele DTO passam a ser aplicadas nesse também
// Usamos o PartialType pra dizer que não vamos usar todas as regras que vamos extender do CreateUserDTO
export class UpdatePatchUserDTO extends PartialType(CreateUserDTO) {

 
}