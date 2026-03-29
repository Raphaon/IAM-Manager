import mongoose from 'mongoose'
import { Permission } from './permission.model'
import { Resource } from '../resources/resource.model'
import { AppError } from '../../shared/errors/AppError'
import { CreatePermissionDto } from '../../types/iam.types'

export class PermissionService {
  static async create(data: CreatePermissionDto) {
    if (!mongoose.Types.ObjectId.isValid(data.resourceId)) {
      throw new AppError('Invalid resourceId', 400)
    }

    const resource = await Resource.findById(data.resourceId)

    if (!resource) {
      throw new AppError('Resource not found', 404)
    }

    if (!resource.allowedActions.includes(data.action)) {
      throw new AppError('Action is not allowed for this resource', 400)
    }

    const key = `${resource.name}.${data.action}`

    const existing = await Permission.findOne({ key })
    if (existing) {
      throw new AppError('Permission already exists', 409)
    }

    return Permission.create({
      resourceId: resource._id,
      action: data.action,
      key,
      description: data.description?.trim()
    })
  }

  static async findAll() {
    return Permission.find()
      .populate('resourceId')
      .sort({ key: 1 })
  }

  static async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid permission id', 400)
    }

    const permission = await Permission.findById(id).populate('resourceId')
    if (!permission) {
      throw new AppError('Permission not found', 404)
    }

    return permission
  }
}