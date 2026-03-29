import { Router } from 'express'
import { UserController } from './user.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorize } from '../../middlewares/permission.middleware'

const router = Router()

router.get('/', authMiddleware, authorize('read', 'user'), UserController.list)
router.get('/:id', authMiddleware, authorize('read', 'user'), UserController.getById)
router.patch(
  '/:id/status',
  authMiddleware,
  authorize('update', 'user'),
  UserController.updateStatus
)

export default router

