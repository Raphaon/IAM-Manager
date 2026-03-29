import { Request, Response, NextFunction } from 'express'
import { AuditService } from './audit.service'

export class AuditController {
  static async list(req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await AuditService.findAll(req.query)
    res.status(200).json(logs)
  } catch (error) {
    next(error)
  }
}
}


