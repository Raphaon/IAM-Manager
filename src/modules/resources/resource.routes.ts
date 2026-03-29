import { Router } from 'express'
import { ResourceController } from './resource.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

router.post('/', authMiddleware, ResourceController.create)
router.get('/', authMiddleware, ResourceController.list)

export default router