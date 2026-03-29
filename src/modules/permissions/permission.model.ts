import mongoose from 'mongoose'

const PermissionSchema = new mongoose.Schema(
  {
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true
    },
    action: {
      type: String,
      required: true,
      enum: ['create', 'read', 'update', 'delete', 'approve']
    },
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
)

PermissionSchema.index({ resourceId: 1, action: 1 }, { unique: true })

export const Permission = mongoose.model('Permission', PermissionSchema)