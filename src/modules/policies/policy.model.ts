import mongoose from 'mongoose'

const PolicySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    effect: {
      type: String,
      required: true,
      enum: ['allow', 'deny']
    },
    resource: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    action: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    scope: {
      type: String,
      enum: ['global', 'node', 'descendants', 'self'],
      default: 'global'
    },
    appliesTo: {
      roleIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Role'
        }
      ],
      userIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      nodeIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Node'
        }
      ]
    },
    conditions: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    priority: {
      type: Number,
      default: 100
    }
  },
  { timestamps: true }
)

PolicySchema.index({ resource: 1, action: 1, isActive: 1 })

export const Policy = mongoose.model('Policy', PolicySchema)