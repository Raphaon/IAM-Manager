import { Request, Response, NextFunction } from 'express'
import { UserService } from './user.service'
import { AppError } from '../../shared/errors/AppError'

export class UserController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.findAll()
      res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id)
        const user = await UserService.findPublicById(id)

      if (!user) {
        throw new AppError('User not found', 404)
      }

      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { isActive } = req.body

      if (typeof isActive !== 'boolean') {
        throw new AppError('isActive must be a boolean', 400)
      }

      const id = String(req.params.id)
        const user = await UserService.updateStatus(id, isActive)

      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }
}