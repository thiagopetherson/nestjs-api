import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common' // Importamos o ValidatorPipe
import { LogInterceptor } from './inteceptors/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitando o Cors do Express padrão (Ali poderíamos passar um objeto de configuração.) Nesse link podemos ver mais detalhes: https://github.com/expressjs/cors
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe()); // Adicionamos essa linha para o ValidatorPipe

  // Chamando o Interceptor de forma global
  // app.useGlobalInterceptors(new LogInterceptor());

  await app.listen(3000);
}
bootstrap();
