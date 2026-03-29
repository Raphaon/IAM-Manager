import mongoose from 'mongoose'
import { Policy } from './policy.model'
import { AppError } from '../../shared/errors/AppError'
import { CreatePolicyDto } from '../../types/policy.types'

export class PolicyService {
  static async create(data: CreatePolicyDto) {
    if (!data.name?.trim()) {
      throw new AppError('Policy name is required', 400)
    }

    if (!data.resource?.trim()) {
      throw new AppError('Policy resource is required', 400)
    }

    if (!data.action?.trim()) {
      throw new AppError('Policy action is required', 400)
    }

    if (!data.conditions || typeof data.conditions !== 'object') {
      throw new AppError('Policy conditions are required', 400)
    }

    const roleIds = data.appliesTo?.roleIds ?? []
    const userIds = data.appliesTo?.userIds ?? []
    const nodeIds = data.appliesTo?.nodeIds ?? []

    for (const id of [...roleIds, ...userIds, ...nodeIds]) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(`Invalid appliesTo id: ${id}`, 400)
      }
    }

    return Policy.create({
      name: data.name.trim(),
      description: data.description?.trim(),
      effect: data.effect,
      resource: data.resource.trim().toLowerCase(),
      action: data.action.trim().toLowerCase(),
      scope: data.scope ?? 'global',
      appliesTo: {
        roleIds,
        userIds,
        nodeIds
      },
      conditions: data.conditions,
      isActive: true
    })
  }

  static async findAll() {
    return Policy.find()
      .populate('appliesTo.roleIds')
      .populate('appliesTo.userIds', '-passwordHash')
      .populate('appliesTo.nodeIds')
      .sort({ priority: -1, createdAt: -1 })
  }

  static async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid policy id', 400)
    }

    const policy = await Policy.findById(id)
      .populate('appliesTo.roleIds')
      .populate('appliesTo.userIds', '-passwordHash')
      .populate('appliesTo.nodeIds')

    if (!policy) {
      throw new AppError('Policy not found', 404)
    }

    return policy
  }

  static async findApplicable(params: {
    resource: string
    action: string
    userId: string
    roleIds: string[]
    nodeIds: string[]
  }) {
    const { resource, action, userId, roleIds, nodeIds } = params

    return Policy.find({
      isActive: true,
      resource: resource.toLowerCase(),
      action: action.toLowerCase(),
      $or: [
        { 'appliesTo.userIds': userId },
        { 'appliesTo.roleIds': { $in: roleIds } },
        { 'appliesTo.nodeIds': { $in: nodeIds } },
        {
          'appliesTo.userIds.0': { $exists: false },
          'appliesTo.roleIds.0': { $exists: false },
          'appliesTo.nodeIds.0': { $exists: false }
        }
      ]
    }).sort({ priority: -1, createdAt: -1 })
  }
}