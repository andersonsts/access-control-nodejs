import 'reflect-metadata';
import express from 'express';
import router from './routes';

import './database';

import uploadConfig from './config/upload';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(router);

app.listen(3333, () => {
  console.log('Server started in http://localhost:3333 🚀');
});
