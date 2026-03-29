import { Request, Response, NextFunction } from 'express'
import { AccessService } from '../core/iam/access.service'
import { AppError } from '../shared/errors/AppError'
import { AuthorizeOptions } from '../types/context.types'
import { AuditService } from '../modules/audit/audit.service'

export const authorize = (
  action: string,
  resource: string,
  options?: AuthorizeOptions
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401)
      }

      const nodeId = options?.getNodeId ? options.getNodeId(req) : undefined
      const resourceData = options?.getResourceData
        ? options.getResourceData(req)
        : undefined

      const allowed = await AccessService.can({
        userId: req.user.userId,
        systemRole: req.user.systemRole,
        action,
        resource,
        nodeId,
        resourceData
      })

      await AuditService.log({
        userId: req.user.userId,
        action,
        resource,
        resourceId: typeof req.params.id === 'string' ? req.params.id : null,
        nodeId: nodeId ?? null,
        result: allowed ? 'success' : 'denied',
        metadata: {
          method: req.method,
          path: req.originalUrl
        }
      })

      if (!allowed) {
        throw new AppError('Forbidden', 403)
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}