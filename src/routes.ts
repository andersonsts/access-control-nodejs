import { Router } from 'express';

import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import PermissionController from './controllers/PermissionController';
import RoleController from './controllers/RoleController';
import ProductController from './controllers/ProductController';

import { is } from './middlewares/permission';

const router = Router();

router.post('/users', UserController.create);
router.post('/sessions', SessionController.create);
router.post('/permissions', PermissionController.create);
router.post('/roles', RoleController.create);

router.post('/products', is(['admin']), ProductController.create);
router.get('/products', is(['admin', 'user']), ProductController.index);
router.get('/products/:id', is(['admin', 'user']), ProductController.show);

export default router;
