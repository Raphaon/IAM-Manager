import { Request, Response, NextFunction } from 'express'
import { PermissionService } from './permission.service'

export class PermissionController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const permission = await PermissionService.create(req.body)
      res.status(201).json(permission)
    } catch (error) {
      next(error)
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const permissions = await PermissionService.findAll()
      res.status(200).json(permissions)
    } catch (error) {
      next(error)
    }
  }
}