import mongoose from 'mongoose'

const ResourceSchema = new mongoose.Schema(
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
    allowedActions: [
      {
        type: String,
        enum: ['create', 'read', 'update', 'delete', 'approve']
      }
    ],
    allowedFields: [
      {
        type: String,
        trim: true
      }
    ]
  },
  { timestamps: true }
)

export const Resource = mongoose.model('Resource', ResourceSchema)