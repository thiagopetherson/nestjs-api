import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Module({
  providers: [PrismaService], // Declarando que o prisma service faz parte
  exports: [PrismaService], // Disponibilizando o prisma service
})

export class PrismaModule {}