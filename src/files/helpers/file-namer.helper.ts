import { v4 as uuid } from 'uuid';

export const fileNamer = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) => {
  const fileExtension = file.mimetype.split('/')[1];

  const fileName = `${uuid()}.${fileExtension}`;
  cb(null, fileName);

  // cb()
};
