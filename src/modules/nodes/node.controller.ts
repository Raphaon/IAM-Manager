import { Request, Response, NextFunction } from 'express'
import { NodeService } from './node.service'

export class NodeController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const node = await NodeService.create(req.body)
      res.status(201).json(node)
    } catch (error) {
      next(error)
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const nodes = await NodeService.findAll()
      res.status(200).json(nodes)
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
    const id = String(req.params.id)
    const node = await NodeService.findById(id)
      res.status(200).json(node)
    } catch (error) {
      next(error)
    }
  }

  static async tree(req: Request, res: Response, next: NextFunction) {
    try {
      const tree = await NodeService.buildTree(null)
      res.status(200).json(tree)
    } catch (error) {
      next(error)
    }
  }
}