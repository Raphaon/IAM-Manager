import { Request, Response, NextFunction } from 'express'
import { ResourceService } from './resource.service'

export class ResourceController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const resource = await ResourceService.create(req.body)
      res.status(201).json(resource)
    } catch (error) {
      next(error)
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const resources = await ResourceService.findAll()
      res.status(200).json(resources)
    } catch (error) {
      next(error)
    }
  }
}