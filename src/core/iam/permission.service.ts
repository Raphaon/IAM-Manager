import { Role } from '../../modules/roles/role.model'
import { AppError } from '../../shared/errors/AppError'
import mongoose from 'mongoose'

export class IAMPermissionService {
  static async roleHasPermission(
    roleId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      throw new AppError('Invalid roleId', 400)
    }

    const role = await Role.findById(roleId).populate({
      path: 'permissionIds',
      populate: {
        path: 'resourceId'
      }
    })

    if (!role) {
      throw new AppError('Role not found', 404)
    }

    const permissions = role.permissionIds as any[]

    return permissions.some((permission) => {
      const resourceDoc = permission.resourceId
      return (
        permission.action === action &&
        resourceDoc &&
        resourceDoc.name === resource
      )
    })
  }
}