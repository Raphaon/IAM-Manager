import { Request, Response, NextFunction } from 'express'
import { RoleService } from './role.service'

export class RoleController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const role = await RoleService.create(req.body)
      res.status(201).json(role)
    } catch (error) {
      next(error)
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await RoleService.findAll()
      res.status(200).json(roles)
    } catch (error) {
      next(error)
    }
  }


    static async addPermission(req: Request, res: Response, next: NextFunction) {
        const roleId = String(req.params.roleId)
        const permissionId = String(req.params.permissionId)
    try {
      const role = await RoleService.addPermission(
        roleId,
        permissionId
      )
      res.status(200).json(role)
    } catch (error) {
      next(error)
    }
  }

  static async getPermissions(req: Request, res: Response, next: NextFunction) {
    try {
        const roleId = String(req.params.roleId)
        const permissions = await RoleService.getPermissions(roleId)
      res.status(200).json(permissions)
    } catch (error) {
      next(error)
    }
  }
  
}