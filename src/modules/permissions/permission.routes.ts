import { Router } from 'express'
import { PermissionController } from './permission.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

router.post('/', authMiddleware, PermissionController.create)
router.get('/', authMiddleware, PermissionController.list)

export default router