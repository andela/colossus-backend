import { Router } from 'express';
import authorize from '../../middlewares/authorize';
import Permission from '../../controllers/permission';

const { assignPermission } = Permission;

const router = Router();

router.patch('/roles/:roleId/permissions', authorize, assignPermission);

export default router;
