import { IsEmail, IsStrongPassword } from "class-validator";


export class AuthLoginDTO {

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minUppercase: 1
  })
  password: string;
}