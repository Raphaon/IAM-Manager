import { Router } from 'express'
import { ResourceController } from './resource.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireAdmin } from '../../middlewares/admin.middleware'

const router = Router()

router.post('/', authMiddleware, requireAdmin, ResourceController.create)
router.get('/', authMiddleware, ResourceController.list)

export default router