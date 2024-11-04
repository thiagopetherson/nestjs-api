import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
   // O código desse arquivo fica na documentação do NestJs

  // Quando o módulo for criado, aqui especificamos o que queremos que aconteça
  async onModuleInit () {
    // Abrindo a conexão
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {    
    process.on('beforeExit', async () => {
      // Fechando a conexão
      await app.close();
    })
  }
} 