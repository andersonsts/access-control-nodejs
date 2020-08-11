import 'reflect-metadata';

import express, { Request, NextFunction, Response } from 'express';
import { errors } from 'celebrate';
import 'express-async-errors';

import uploadConfig from './config/upload';

import AppError from './errors/AppError';
import router from './routes';

import './database';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(router);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if(err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

app.listen(3333, () => {
  console.log('Server started in http://localhost:3333 🚀');
});
