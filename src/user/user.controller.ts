import { Controller, Post, Get, Put, Patch, Delete, Body, UseInterceptors, UseGuards } from '@nestjs/common'
import { CreateUserDTO } from './DTO/create-user.dto'
import { UpdatePutUserDTO } from './DTO/update-put-user.dto'
import { UpdatePatchUserDTO } from './DTO/update-patch-user.dto'
import { UserService } from './user.service'
import { LogInterceptor } from 'src/inteceptors/log.interceptor'
import { ParamId } from 'src/decorators/param-id.decorator'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enums/role.enums'
import { RoleGuard } from 'src/guards/role.guard'
import { AuthGuard } from 'src/guards/auth.guard'
import { SkipThrottle, Throttle } from '@nestjs/throttler'

@Roles(Role.Admin) // Nesse decorator estamos dizendo que somente o Role.Admin tem acesso nas rotas desse controller
@UseGuards(AuthGuard, RoleGuard) // Ele passa primeiro pelo AuthGuard e depois vai pro RoleGuard (essa ordem é importante)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {

  constructor (private readonly userService: UserService) {}

  /// Método store. Decorator @Body (que serve para pegar os dados do corpo da requisição) e decorator @Post. Usamos também o SkipThrottle, para ignorar essa rota no Throttle
  @SkipThrottle()
  @Post()
  async store (@Body() data: CreateUserDTO) {
    return await this.userService.store(data)
  }

  // Método index. Seria pra retornar todos
  @Get()
  async index () {
    return await this.userService.index();
  }

  // Método show. Seria pra retornar um.
  @Get(':id')
  async show (@ParamId() id: number) { 
    return this.userService.show(id);
  }

  // Método update. Seria pra atualizar todos os dados. Usamos @Put. Decorator @Body e @Param
  @Put(':id')
  async update(@Body() data: UpdatePutUserDTO, @ParamId() id: number) { // também podemos receber os dados da requisição daquela forma ali (data)
    return await this.userService.update(id, data);
  }

  // Método updatePartials. Seria pra atualizar alguns dados. Usamos @Patch. Decorator @Body e @Param
  @Patch(':id')
  async updatePartial(@Body() data: UpdatePatchUserDTO, @ParamId() id: number) {
    return await this.userService.updatePartial(id, data);
  }

  // Método delete. Seria pra deletar um dado. Usamos @Delete. Decorator @Param. Usamos também p Pipe ParseIntPipe para converter
  @Delete(':id')
  async delete(@ParamId() id: number) {
    return this.userService.delete(id);
  }

}