import mongoose, { Types } from 'mongoose'
import { Resource } from './resource.model'
import { AppError } from '../../shared/errors/AppError'
import { CreateResourceDto } from '../../types/iam.types'

export class ResourceService {
  static async create(data: CreateResourceDto) {
    const name = data.name?.trim().toLowerCase()

    if (!name) {
      throw new AppError('Resource name is required', 400)
    }

    if (!Array.isArray(data.allowedActions) || data.allowedActions.length === 0) {
      throw new AppError('allowedActions is required', 400)
    }

    const existing = await Resource.findOne({ name })
    if (existing) {
      throw new AppError('Resource already exists', 409)
    }

    return Resource.create({
      name,
      description: data.description?.trim(),
      allowedActions: data.allowedActions,
      allowedFields: data.allowedFields ?? []
    })
  }

  static async findAll() {
    return Resource.find().sort({ name: 1 })
  }

  static async findById(id: string) {

      if (!Types.ObjectId.isValid(id)) {
            throw new AppError('Invalid id', 400)
        }
        
    const resource = await Resource.findById(id)
    if (!resource) {
      throw new AppError('Resource not found', 404)
    }
    return resource
  }
}