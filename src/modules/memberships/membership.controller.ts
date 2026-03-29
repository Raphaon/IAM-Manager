import { Request, Response, NextFunction } from 'express'
import { MembershipService } from './membership.service'

export class MembershipController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const membership = await MembershipService.create(req.body)
      res.status(201).json(membership)
    } catch (error) {
      next(error)
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const memberships = await MembershipService.findAll()
      res.status(200).json(memberships)
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id)
        const membership = await MembershipService.findById(id)
      res.status(200).json(membership)
    } catch (error) {
      next(error)
    }
  }

  static async getByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.params.userId)
        const memberships = await MembershipService.findByUser(userId)
      res.status(200).json(memberships)
    } catch (error) {
      next(error)
    }
  }

  static async getByNode(req: Request, res: Response, next: NextFunction) {
    try {
      const nodeId = String(req.params.nodeId)
        const memberships = await MembershipService.findByNode(nodeId)
      res.status(200).json(memberships)
    } catch (error) {
      next(error)
    }
  }
}