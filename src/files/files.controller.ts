import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { extname, join } from 'path';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

   @Post('upload')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: join(process.cwd(), 'uploads'),
          filename: (req, file, cb) => {
            cb(null, file.originalname);
          },
        }),
      }),
    )
    async uploadFile(
      @UploadedFile() file: Express.Multer.File,
      @Res() res: Response,
    ) {
      if (!file) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'No file uploaded' });
      }

      const savedFile = await this.filesService.create({
        originalName: file.originalname,
        storedName: file.filename,
        path: `/uploads/${file.filename}`,
        mimeType: file.mimetype,
        extension: extname(file.originalname).replace('.', '') || undefined,
        sizeBytes: String(file.size),
      });

      return res
        .status(HttpStatus.OK)
        .json({
          message: 'File uploaded successfully',
          file: savedFile,
        });
    }
    

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}
