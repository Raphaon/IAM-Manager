import mongoose, { Types } from 'mongoose'
import { User } from './user.model'
import { AppError } from '../../shared/errors/AppError'

export class UserService {
  static async findByEmail(email: string) {
    return User.findOne({ email: email.toLowerCase().trim() })
  }

  static async findById(userId: string) {
    return User.findById(userId)
  }


  static async create(data: {
    email: string
    passwordHash: string
    firstName?: string
    lastName?: string
  }) {
    return User.create({
      email: data.email.toLowerCase().trim(),
      passwordHash: data.passwordHash,
      firstName: data.firstName,
      lastName: data.lastName
    })
  }


  static async updateLastLogin(userId: string) {
    return User.findByIdAndUpdate(
      userId,
      { lastLoginAt: new Date() },
      { new: true }
    )
  }

  static async findAll() {
    return User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 })
  }

  static async findPublicById(userId: string) {
     if (!Types.ObjectId.isValid(userId)){
            throw new AppError('Invalid id', 400)
      }

    return User.findById(userId, { passwordHash: 0 })
  }

  static async updateStatus(userId: string, isActive: boolean) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true, projection: { passwordHash: 0 } }
    )

    if (!user) {
      throw new AppError('User not found', 404)
    }

    return user
  }
}