import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./DTO/auth-register.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt'; // importamos a biblioteca assim pq ela não foi escrita em JS
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {

  private issuer = 'login';
  private audience = 'users';

  constructor(
    private readonly JWTService: JwtService, 
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailer:MailerService
  ){}

  // Método para criar token
  createToken (user: User) { // Esse User vem do Prima Client (fizemos isso para tipar)

    // Aqui vamos definir a estrutura do token (também colocamos as regras, que fica na parte de payload)
    return {
      accessToken: this.JWTService.sign({
        id: user.id,
        name: user.name,
        email: user.email
      },{
        expiresIn: '7 days', // token expira nesse tempo
        subject: String(user.id), // Todos esses dados do payload precisa sem string
        issuer: this.issuer, // Quem está enviando
        audience: this.audience // Não consegui pegar essa informação na aula
      })
    }
  }

  // Método para verificar um token
  checkToken (token: string) {
    try {
      const data = this.JWTService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });

      return data
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  // Método para verificar se o token é válido (um complemento ao de cima. Não vamos utilizar esse método por enquanto)
  isValidToken(token: string) {
    try {
      this.checkToken(token)
      return true
    } catch (e) {
      return false;
    }
  }

  // Método para fazer login
  async login (email: string, password: string) {   

    // Verificando se usuário existe
    const user = await this.prisma.user.findFirst({
      where: {
        email
      }
    });
      
    if (!user) {
      throw new UnauthorizedException('Email e/ou senha incorretos.')
    }

    // Comparando e verificando se o hash é válido para o password (ou seja se password é válido para user.password)
    if(!(await bcrypt.compare(password, user.password))) { // O segundo parâmetro (do compare) é qual informação está encryptada
      throw new UnauthorizedException('Email e/ou senha incorretos.')
    }
    
    // Loga o usuário
    return this.createToken(user);
  }

  // Método para esqueceu a senha
  async forget (email: string) {
    // Verificando se usuário existe
    const user = await this.prisma.user.findFirst({
      where: {
        email
      }
    });

    if (!user) {
      throw new UnauthorizedException('Email está incorreto.');
    }

    const token = this.JWTService.sign({
      id: user.id,
    },{
      expiresIn: "30 minutes",
      subject: String(user.id),
      issuer: 'forget',
      audience: 'users',
    });

    await this.mailer.sendMail({
      subject: 'Recuperação de Senha',
      to: 'joao@hcode.com',
      template: 'forget',
      context: { // Variáveis para passar para o template
        name: user.name,
        token
      }
    });

    return true;
  }

  // Método para reset password
  async reset (password: string, token: string) {
    try {
      const data:any = this.JWTService.verify(token, {
        issuer: 'forget',
        audience: 'users',
      });

      if (isNaN(Number(data.id))) {
        throw new BadRequestException("Token é inválido.");
      }

      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(password, salt);

      const user = await this.prisma.user.update({
        where: {
          id: data.id,
        },
        data: {
          password: password,
        }
      });
  
      // Já loga o usuário
      return this.createToken(user);
      
    } catch (e) {
      throw new BadRequestException(e);
    }   
  }

  // Método para registrar
  async register (data: AuthRegisterDTO) {
    const user = await this.userService.store(data);

    // Já loga o usuário
    return this.createToken(user);
  }
}