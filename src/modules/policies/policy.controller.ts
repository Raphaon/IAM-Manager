import { Request, Response, NextFunction } from 'express'
import { PolicyService } from './policy.service'

export class PolicyController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const policy = await PolicyService.create(req.body)
      res.status(201).json(policy)
    } catch (error) {
      next(error)
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const policies = await PolicyService.findAll()
      res.status(200).json(policies)
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id)
        const policy = await PolicyService.findById(id)
      res.status(200).json(policy)
    } catch (error) {
      next(error)
    }
  }
}