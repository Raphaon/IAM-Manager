import { AuditLog } from './audit.model'

interface CreateAuditLogInput {
  userId?: string | null
  action: string
  resource: string
  resourceId?: string | null
  nodeId?: string | null
  result: 'success' | 'denied' | 'error'
  metadata?: Record<string, unknown>
}

export class AuditService {
  static async log(input: CreateAuditLogInput) {
    return AuditLog.create({
      userId: input.userId ?? null,
      action: input.action,
      resource: input.resource,
      resourceId: input.resourceId ?? null,
      nodeId: input.nodeId ?? null,
      result: input.result,
      metadata: input.metadata ?? {}
    })
  }

static async findAll(query?: { page?: unknown; limit?: unknown }) {
  const { getPagination } = await import('../../shared/utils/pagination')
  const { page, limit, skip } = getPagination(query ?? {}, 20, 100)

  const [items, total] = await Promise.all([
    AuditLog.find()
      .populate('userId', '-passwordHash')
      .populate('nodeId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AuditLog.countDocuments()
  ])

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}
}