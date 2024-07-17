import { Controller, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Response } from 'express';

@Controller('files')
export class FilesController {
  
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null, file.originalname); // Conserva el nombre original del archivo
      }
    })
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    console.log(file);
    if (!file) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' });
    }
    return res.status(HttpStatus.OK).json({ message: 'File uploaded successfully', file });
  }

}

// import { Controller, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
// import { FileInterceptor } from "@nestjs/platform-express";
// import { diskStorage } from "multer";
// import { Response } from 'express';

// @Controller('files')
// export class FilesController {
  

//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file', {
//     storage: diskStorage({
//       destination: './uploads',
//       filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const filename = `${file.originalname}-${uniqueSuffix}`;
//         cb(null, filename);
//       }
//     })
//   }))
//   async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
//     console.log(file);
//     if (!file) {
//       return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' });
//     }
//     return res.status(HttpStatus.OK).json({ message: 'File uploaded successfully', file });
//   }

// }
