import mongoose from 'mongoose'
import { Membership } from './membership.model'
import { User } from '../users/user.model'
import { Node } from '../nodes/node.model'
import { Role } from '../roles/role.model'
import { AppError } from '../../shared/errors/AppError'
import { CreateMembershipDto } from '../../types/iam.types'

export class MembershipService {
  static async create(data: CreateMembershipDto) {
    const { userId, nodeId, roleId } = data

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid userId', 400)
    }

    if (!mongoose.Types.ObjectId.isValid(nodeId)) {
      throw new AppError('Invalid nodeId', 400)
    }

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      throw new AppError('Invalid roleId', 400)
    }

    const [user, node, role] = await Promise.all([
      User.findById(userId),
      Node.findById(nodeId),
      Role.findById(roleId)
    ])

    if (!user) {
      throw new AppError('User not found', 404)
    }

    if (!node) {
      throw new AppError('Node not found', 404)
    }

    if (!role) {
      throw new AppError('Role not found', 404)
    }

    const existing = await Membership.findOne({
      userId,
      nodeId,
      roleId
    })

    if (existing) {
      throw new AppError('Membership already exists', 409)
    }

    return Membership.create({
      userId,
      nodeId,
      roleId,
      status: data.status ?? 'active',
      inheritsToDescendants: data.inheritsToDescendants ?? true
    })
  }

  static async findAll() {
    return Membership.find()
      .populate('userId', '-passwordHash')
      .populate('nodeId')
      .populate({
        path: 'roleId',
        populate: {
          path: 'permissionIds',
          populate: { path: 'resourceId' }
        }
      })
      .sort({ createdAt: -1 })
  }

  static async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid membership id', 400)
    }

    const membership = await Membership.findById(id)
      .populate('userId', '-passwordHash')
      .populate('nodeId')
      .populate({
        path: 'roleId',
        populate: {
          path: 'permissionIds',
          populate: { path: 'resourceId' }
        }
      })

    if (!membership) {
      throw new AppError('Membership not found', 404)
    }

    return membership
  }

  static async findByUser(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid userId', 400)
    }

    return Membership.find({ userId })
      .populate('nodeId')
      .populate({
        path: 'roleId',
        populate: {
          path: 'permissionIds',
          populate: { path: 'resourceId' }
        }
      })
      .sort({ createdAt: -1 })
  }

  static async findByNode(nodeId: string) {
    if (!mongoose.Types.ObjectId.isValid(nodeId)) {
      throw new AppError('Invalid nodeId', 400)
    }

    return Membership.find({ nodeId })
      .populate('userId', '-passwordHash')
      .populate({
        path: 'roleId',
        populate: {
          path: 'permissionIds',
          populate: { path: 'resourceId' }
        }
      })
      .sort({ createdAt: -1 })
  }
}