import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
    private readonly authService: AuthService, 
    private readonly userService: UserService
  ) {}

  async canActivate (context: ExecutionContext) {

    const request = context.switchToHttp().getRequest();   

    const { authorization } = request.headers;
    
    try{
      const data = this.authService.checkToken((authorization ?? '').split(' ')[1]); // Faço esse split pois o conteúdo vem: "bearer stringdotokenqueveionoheader".
      
      // Adicionando o token no request (.tokenPayload não existe, estás sendo criado agora)
      request.tokenPayload = data;

      // Obtendo os dados do usuário, para inserir esses dados no request e deixar o retorno mais completo. Criamos ali a propriedade .user no request
      request.user = await this.userService.show(data.id);
      
      return true;
    } catch (e) {
      return false;
    }
    
  }
}