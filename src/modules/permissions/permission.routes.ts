import { Router } from 'express'
import { PermissionController } from './permission.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireAdmin } from '../../middlewares/admin.middleware'

const router = Router()

router.post('/', authMiddleware, requireAdmin, PermissionController.create)
router.get('/', authMiddleware, PermissionController.list)

export default router