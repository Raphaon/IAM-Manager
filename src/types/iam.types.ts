export type ActionType = 'create' | 'read' | 'update' | 'delete' | 'approve'

export interface CreateRoleDto {
  name: string
  description?: string
}

export interface CreateResourceDto {
  name: string
  description?: string
  allowedActions: ActionType[]
  allowedFields?: string[]
}

export interface CreatePermissionDto {
  resourceId: string
  action: ActionType
  description?: string
}

export interface CreateMembershipDto {
  userId: string
  nodeId: string
  roleId: string
  status?: 'active' | 'inactive'
  inheritsToDescendants?: boolean
}

export interface AccessCheckInput {
  userId: string
  systemRole?: 'admin' | 'user'
  action: string
  resource: string
  nodeId?: string
}

export interface AccessCheckInput {
  userId: string
  systemRole?: 'admin' | 'user'
  action: string
  resource: string
  nodeId?: string
  resourceData?: Record<string, unknown>
}