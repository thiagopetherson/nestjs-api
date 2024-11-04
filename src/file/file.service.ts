import { Injectable } from "@nestjs/common";
import { writeFile } from "fs/promises"; // Assim que salvamos o arquivo (isso é do Node mesmo)

@Injectable()
export class FileService {

  async uploadFile(file: Express.Multer.File, path: string) {    

    // Salvando o arquivo 
    // O primeiro parâmetro do writeFile é onde salvaremos o arquivo (Criamos as pastas "storage/files" para salvar os arquivos) e nomeamos o arquivo
    // O segundo parâmetro é o conteúdo (dados) do arquivo
    // No primeiro parâmetroSubimos dois diretórios e depois entramos em "storage/files"
    return await writeFile(path, file.buffer);
  }
}