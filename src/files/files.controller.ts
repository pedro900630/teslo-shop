import {
  BadRequestException,
  Controller,
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

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      storage: diskStorage({
        destination: './static/uploads',
        // filename: (req, file, cb) => {
        //   const originalName = file.originalname;
        //   const fileExtension = originalName.split('.').pop();
        //   const fileName = originalName
        //     .replace(`.${fileExtension}`, '')
        //     .toLowerCase()
        //     .replace(/\s+/g, '-');
        //   cb(null, `${fileName}-${Date.now()}.${fileExtension}`);
        // },
      }),
    }),
  )
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    res.setHeader('Content-Type', file.mimetype);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${file.originalname}"`,
    );
    res.send(file.buffer);
  }
}
