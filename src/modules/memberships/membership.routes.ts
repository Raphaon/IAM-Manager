import { Router } from 'express'
import { MembershipController } from './membership.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireAdmin } from '../../middlewares/admin.middleware'

const router = Router()

router.post('/', authMiddleware, requireAdmin, MembershipController.create)
router.get('/', authMiddleware, requireAdmin, MembershipController.list)
router.get('/user/:userId', authMiddleware, requireAdmin, MembershipController.getByUser)
router.get('/node/:nodeId', authMiddleware, requireAdmin, MembershipController.getByNode)
router.get('/:id', authMiddleware, requireAdmin, MembershipController.getById)

export default router
