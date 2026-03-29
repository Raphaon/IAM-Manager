import mongoose from 'mongoose'

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    description: {
      type: String,
      trim: true
    },
    isSystem: {
      type: Boolean,
      default: false
    },
    permissionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
      }
    ]
  },
  { timestamps: true }
)

export const Role = mongoose.model('Role', RoleSchema)