import mongoose from 'mongoose'

const AuditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    action: {
      type: String,
      required: true,
      trim: true
    },
    resource: {
      type: String,
      required: true,
      trim: true
    },
    resourceId: {
      type: String,
      default: null
    },
    nodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Node',
      default: null
    },
    result: {
      type: String,
      enum: ['success', 'denied', 'error'],
      required: true
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
)

AuditLogSchema.index({ userId: 1, createdAt: -1 })
AuditLogSchema.index({ action: 1, resource: 1, createdAt: -1 })

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema)