import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { fileFilter } from './helpers/file-filter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/file-namer.helper';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
    // @Res() res: Response,
  ) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    // console.log(file);
    // const secureUrl = file.filename;
    const host = this.configService.get<string>('HOST_API');
    const secureUrl = `${host}/files/product/${file.filename}`;

    return {
      secureUrl,
    };

    // res.setHeader('Content-Type', file.mimetype);
    // res.setHeader(
    //   'Content-Disposition',
    //   `inline; filename="${file.originalname}"`,
    // );
    // res.send(file.buffer);
  }
}
