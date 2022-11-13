import multer from 'multer';

export const multerMiddleware = multer({
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
