import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./DTO/create-user.dto";
import { UpdatePutUserDTO } from "./DTO/update-put-user.dto";
import { UpdatePatchUserDTO } from "./DTO/update-patch-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt'; // importamos a biblioteca assim pq ela não foi escrita em JS

@Injectable()
export class UserService {

  // Construtor (ali estamos tipando)
  constructor (private readonly prisma: PrismaService) {}

  // Métodos
  async store({ email, name, password, birth }: CreateUserDTO) {    

    const salt = await bcrypt.genSalt()

    // O segundo parâmetro é a força do HASH (como sugestão, colocamos ali pra própria lib decidir. Mas poderiamos passar um valor ali, como 10 por exemplo)
    password = await bcrypt.hash(password, salt); // Estamos criando um hash da senha recebida como string

    // Abaixo, aquela condicional no birth é para o caso de vir null e também para converter a string date para o formato (que é o esperado pelo Prisma)
    return await this.prisma.user.create({
      data: { email, name, password, birth: birth ? new Date(birth) : null }
    });
  }
 
  async index() {
    return await this.prisma.user.findMany(); // findMany retorna todos os dados
  }

  async show(id: number) { // Tipamos pra dizer que o id é do tipo number

    // Verificando se o usuário existe
    this.exists(id);

    // O findFirst() com where funcionaria, mas o findUnique é melhor pq ele trabalha com index, e é mais performático
    return await this.prisma.user.findUnique({
      where: {
        id: id
      }
    });
  }

  async update(id:number, { email, name, password, birth, role }: UpdatePutUserDTO) {

    // Verificando se o usuário existe
    this.exists(id);

    const salt = await bcrypt.genSalt()

    // O segundo parâmetro é a força do HASH (como sugestão, colocamos ali pra própria lib decidir. Mas poderiamos passar um valor ali, como 10 por exemplo)
    password = await bcrypt.hash(password, salt); // Estamos criando um hash da senha recebida como string

    // Abaixo, aquela condicional no birth é para o caso de vir null e também para converter a string date para o formato (que é o esperado pelo Prisma)
    return await this.prisma.user.update({
      data: { email, name, password, birth: birth ? new Date(birth) : null, role },
      where: {
        id
      }  
    });
  }

  async updatePartial(id:number, { email, name, password, birth, role }: UpdatePatchUserDTO) {

    // Verificando se o usuário existe
    this.exists(id);

    const data: any = {};

    // Se existir o campo 'birth' então vamos convertê-lo
    if (birth) {
      data.birth = new Date (birth);
    }

    if (email) {
      data.email = email;
    }

    if (name) {
      data.name = name;
    }

    if (password) {
      const salt = await bcrypt.genSalt()

      // O segundo parâmetro é a força do HASH (como sugestão, colocamos ali pra própria lib decidir. Mas poderiamos passar um valor ali, como 10 por exemplo)
      password = await bcrypt.hash(password, salt); // Estamos criando um hash da senha recebida como string

      data.password = password;
    }

    if (role) {
      data.role = role;
    }


    return await this.prisma.user.update({
      data: data,
      where: {
        id
      }  
    });
  }

  async delete(id:number) {

    // Verificando se o usuário existe
    this.exists(id);

    return await this.prisma.user.delete({
      where: {
        id: id
      }
    });
  }

  async exists(id: number) {
    // Verifica se o usuário existe. Se não, chamará uma exception
    const result = await this.prisma.user.count({ where: { id: id } });
    
    if (!result) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }
  }
}