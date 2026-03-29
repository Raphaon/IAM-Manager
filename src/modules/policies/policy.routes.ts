import { Router } from 'express'
import { PolicyController } from './policy.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

router.post('/', authMiddleware, PolicyController.create)
router.get('/', authMiddleware, PolicyController.list)
router.get('/:id', authMiddleware, PolicyController.getById)

export default router