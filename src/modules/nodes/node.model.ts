import mongoose from 'mongoose'

const NodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ['organization', 'branch', 'subbranch', 'department', 'team']
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Node',
      default: null
    },
    ancestors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Node'
      }
    ],
    path: {
      type: String,
      required: true,
      unique: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
)

NodeSchema.index({ parentId: 1 })
NodeSchema.index({ ancestors: 1 })


export const Node = mongoose.model('Node', NodeSchema)