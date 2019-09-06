import { Router } from 'express';
import { authorize } from '../../middlewares/authorize';
import Permission from '../../controllers/permission';
import { checkToken } from '../../middlewares/auth';
import PermissionsValidator from '../../middlewares/validatePermission';

const { validatepermission } = PermissionsValidator;
const { assignPermission } = Permission;

const router = Router();

router.patch('/role/permissions', checkToken, authorize, validatepermission, assignPermission);

export default router;
