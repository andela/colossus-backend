import { Router } from 'express';
import Role from '../../controllers/role';
import authorize from '../../middlewares/authorize';

const { assignRole } = Role;

const router = Router();

router.patch('/roles', authorize, assignRole);

export default router;
