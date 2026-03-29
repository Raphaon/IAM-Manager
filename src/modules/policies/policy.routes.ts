import { Router } from 'express'
import { PolicyController } from './policy.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireAdmin } from '../../middlewares/admin.middleware'

const router = Router()

router.post('/', authMiddleware,requireAdmin, PolicyController.create)
router.get('/', authMiddleware, requireAdmin, PolicyController.list)
router.get('/:id', authMiddleware, requireAdmin, PolicyController.getById)

export default router