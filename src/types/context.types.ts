import { Request } from 'express'

export interface PolicyEvaluationContext {
  user: {
    userId: string
    email?: string
    systemRole?: 'admin' | 'user'
  }
  resource: {
    name: string
    action: string
    nodeId?: string
    ownerId?: string
    status?: string
    classification?: string
    [key: string]: unknown
  }
  context: {
    allowedNodeIds?: string[]
    targetNodeAncestors?: string[]
    membershipNodeIds?: string[]
    [key: string]: unknown
  }
}




export interface AuthorizeOptions {
  getNodeId?: (req: Request) => string | undefined
  getResourceData?: (req: Request) => Record<string, unknown> | undefined
}