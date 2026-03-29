import mongoose from 'mongoose'

const MembershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    nodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Node',
      required: true
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    inheritsToDescendants: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

MembershipSchema.index({ userId: 1 })
MembershipSchema.index({ nodeId: 1 })
MembershipSchema.index({ roleId: 1 })
MembershipSchema.index(
  { userId: 1, nodeId: 1, roleId: 1 },
  { unique: true }
)

export const Membership = mongoose.model('Membership', MembershipSchema)