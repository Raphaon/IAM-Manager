import { Router } from 'express'
import { IAMController } from './iam.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

router.post('/debug-access', authMiddleware, IAMController.debugAccess)

export default router