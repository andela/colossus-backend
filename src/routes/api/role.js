import { Router } from 'express';
import Role from '../../controllers/role';
import { authorize } from '../../middlewares/authorize';
import { checkToken } from '../../middlewares/auth';
import RoleInputValidator from '../../middlewares/validateRole';

const { validateRole } = RoleInputValidator;
const { assignRole } = Role;

const router = Router();

router.patch('/role', checkToken, authorize, validateRole, assignRole);

export default router;
