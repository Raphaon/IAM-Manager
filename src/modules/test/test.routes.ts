import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authorize } from '../../middlewares/permission.middleware'

const router = Router()

router.get(
  '/invoice/:id/read',
  authMiddleware,
  authorize('read', 'invoice', {
    getNodeId: (req) =>
      typeof req.query.nodeId === 'string' ? req.query.nodeId : undefined,
    getResourceData: (req) => ({
      ownerId: req.query.ownerId,
      classification: req.query.classification,
      status: req.query.status,
      amount: req.query.amount ? Number(req.query.amount) : undefined
    })
  }),
  (req, res) => {
    res.status(200).json({
      message: 'Invoice access granted'
    })
  }
)

export default router