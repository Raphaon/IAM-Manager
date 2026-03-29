import { Router } from 'express'
import { AuditController } from './audit.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

router.get('/', authMiddleware, AuditController.list)

export default router