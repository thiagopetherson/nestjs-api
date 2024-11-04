import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> { // A resposta tem que ser um Observable

    // A intenção desse interceptor que criamos é ver quanto tempo demorou a execução, ver a URL e Método Acessado

    const dt = Date.now();

    // O pipe() vai pegar o retorno do handle(). O tap() pega o retorno do controlador manipulador de rota
    return next.handle().pipe(tap(() => {

      // Pegando a URL
      const request = context.switchToHttp().getRequest();

      console.log(`URL:  ${request.url}`);
      console.log(`METHOD:  ${request.method}`);
      console.log(`Execução levou:  ${Date.now() - dt} milisegundos.`);

    }));
  }
}