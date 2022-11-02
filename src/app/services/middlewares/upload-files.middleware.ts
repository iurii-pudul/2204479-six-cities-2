import {NextFunction, Request, Response} from 'express';
import {nanoid} from 'nanoid';
import multer, {diskStorage} from 'multer';
import mime from 'mime-types';
import {MiddlewareInterface} from '../interfaces/middleware/middleware.interface.js';

const COUNT_OF_FILES = 6;

export class UploadFilesMiddleware implements MiddlewareInterface {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
    private availableCount: number,
  ) {
    this.availableCount = availableCount ? availableCount: COUNT_OF_FILES;
  }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const extension = mime.extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${extension}`);
      }
    });

    const uploadSingleFileMiddleware = multer({storage})
      .array(this.fieldName, this.availableCount);

    uploadSingleFileMiddleware(req, res, next);
  }
}
