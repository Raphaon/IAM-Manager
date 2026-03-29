import { Router } from 'express'
import { AuditController } from './audit.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireAdmin } from '../../middlewares/admin.middleware'

const router = Router()

router.get('/', requireAdmin, authMiddleware, AuditController.list)

export default router