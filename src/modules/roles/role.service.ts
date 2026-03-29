import mongoose, { Types } from 'mongoose'
import { Role } from './role.model'
import { AppError } from '../../shared/errors/AppError'
import { CreateRoleDto } from '../../types/iam.types'
import { Permission } from '../permissions/permission.model'

export class RoleService {
  static async create(data: CreateRoleDto) {
    const name = data.name?.trim().toLowerCase()

    if (!name) {
      throw new AppError('Role name is required', 400)
    }

    const existing = await Role.findOne({ name })
    if (existing) {
      throw new AppError('Role already exists', 409)
    }

    return Role.create({
      name,
      description: data.description?.trim()
    })
  }

  static async findAll() {
    return Role.find().sort({ name: 1 })
  }

  static async findById(id: string) {
      if (!Types.ObjectId.isValid(id)){
            throw new AppError('Invalid id', 400)
        }

    const role = await Role.findById(id)
    if (!role) {
      throw new AppError('Role not found', 404)
    }
    return role
  }





    static async addPermission(roleId: string, permissionId: string) {
    const role = await Role.findById(roleId)
    if (!role) {
      throw new AppError('Role not found', 404)
    }

    const permission = await Permission.findById(permissionId)
    if (!permission) {
      throw new AppError('Permission not found', 404)
    }

    const alreadyAssigned = role.permissionIds.some(
      (id: any) => String(id) === String(permissionId)
    )

    if (alreadyAssigned) {
      throw new AppError('Permission already assigned to role', 409)
    }

    role.permissionIds.push(permission._id)
    await role.save()

    return Role.findById(roleId).populate({
      path: 'permissionIds',
      populate: { path: 'resourceId' }
    })
  }

  static async getPermissions(roleId: string) {
    const role = await Role.findById(roleId).populate({
      path: 'permissionIds',
      populate: { path: 'resourceId' }
    })

    if (!role) {
      throw new AppError('Role not found', 404)
    }

    return role.permissionIds
  }
}