import { Router } from 'express'
import { MembershipController } from './membership.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

router.post('/', authMiddleware, MembershipController.create)
router.get('/', authMiddleware, MembershipController.list)
router.get('/user/:userId', authMiddleware, MembershipController.getByUser)
router.get('/node/:nodeId', authMiddleware, MembershipController.getByNode)
router.get('/:id', authMiddleware, MembershipController.getById)

export default router