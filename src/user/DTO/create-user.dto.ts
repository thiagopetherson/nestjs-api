import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from "class-validator"; // Importando as validações do class-validator
import { Role } from "src/enums/role.enums";

export class CreateUserDTO {

  // Estamos dizendo que name tem que ser string
  @IsString() 
  name: string;

  // Estamos dizendo que email tem que ser um email válido
  @IsEmail()
  email: string;

  // Estamos dizendo que password tem que ser uma string que deve ter no mínimo 6 caracteres e 1 deve ser maiúsculo e que ele deve ser forte (IsStrongPassword)
  @IsStrongPassword({
    minLength: 6,
    minUppercase: 1
  })
  password: string;

  // Dizemos que esse campo é opcional e que deve ser uma data em string
  @IsOptional()
  @IsDateString()
  birth?: string;

  // Dizemos que esse campo é opcional e que deve receber um parâmetro enum
  @IsOptional()
  @IsEnum(Role) // Espera um parâmetro enum
  role: number;
}