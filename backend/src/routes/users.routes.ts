import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import * as usersController from '../controllers/users.controller.js';

const router = Router();

router.get('/', requireAuth, requireAdmin, usersController.listUsers);
router.get('/roles', requireAuth, requireAdmin, usersController.listRoles);
router.post('/invite', requireAuth, requireAdmin, usersController.inviteUser);
router.put('/:id', requireAuth, requireAdmin, usersController.editUser);
router.delete('/:id', requireAuth, requireAdmin, usersController.removeUser);
router.post('/setup', usersController.setupPassword); // Unprotected, uses token

export default router;

