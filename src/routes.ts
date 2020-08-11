import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';

import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import PermissionController from './controllers/PermissionController';
import RoleController from './controllers/RoleController';
import ProductController from './controllers/ProductController';

import ensureAuthenticated from './middlewares/ensureAuthenticated';
import { is } from './middlewares/permission';
import { celebrate, Segments, Joi } from 'celebrate';

const router = Router();

const upload = multer(uploadConfig.multer);

router.post('/sessions', celebrate({
  [Segments.BODY]: {
    username: Joi.string().required(),
    password: Joi.string().required()
  }
}) ,SessionController.create);

router.use(ensureAuthenticated);

router.get('/products', ProductController.index);
router.get('/products/:id', ProductController.show);
router.patch('/avatar/:user_id', upload.single('avatar'), UserController.update);

router.use(is(['admin']));

router.post('/users', UserController.create);
router.post('/permissions', PermissionController.create);
router.post('/roles', RoleController.create);

router.post('/products', ProductController.create);
router.put('/products/:product_id', upload.single('image'), ProductController.update);

export default router;
