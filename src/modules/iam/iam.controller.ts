import { Request, Response, NextFunction } from 'express'
import { DebugAccessService } from '../../core/iam/debug-access.service'

export class IAMController {
  
static async debugAccess(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const isAdmin = req.user.systemRole === 'admin'

    const targetUserId =
      isAdmin && typeof req.body.userId === 'string'
        ? req.body.userId
        : req.user.userId

    const input = {
      userId: targetUserId,
      systemRole: req.user.systemRole,
      resource: typeof req.body.resource === 'string' ? req.body.resource : undefined,
      action: typeof req.body.action === 'string' ? req.body.action : undefined,
      nodeId: typeof req.body.nodeId === 'string' ? req.body.nodeId : undefined,
      resourceData:
        req.body.resourceData && typeof req.body.resourceData === 'object'
          ? req.body.resourceData
          : undefined,
    }

    const result = await DebugAccessService.explain(input)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

}