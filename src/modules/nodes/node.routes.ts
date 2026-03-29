import { Router } from 'express'
import { NodeController } from './node.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorize } from '../../middlewares/permission.middleware'

const router = Router()

router.post('/', authMiddleware, authorize('create', 'node'), NodeController.create)
router.get('/', authMiddleware, authorize('read', 'node'), NodeController.list)
router.get('/tree', authMiddleware, authorize('read', 'node'), NodeController.tree)
router.get(
  '/:id',
  authMiddleware,
  authorize('read', 'node', {
    getNodeId: (req) => {
  const id = req.params.id
  return typeof id === 'string' ? id : undefined
}
  }),
  NodeController.getById
)

export default router