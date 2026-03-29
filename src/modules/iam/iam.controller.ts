import { Request, Response, NextFunction } from 'express'
import { DebugAccessService } from '../../core/iam/debug-access.service'

export class IAMController {
  static async debugAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await DebugAccessService.explain(req.body)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}