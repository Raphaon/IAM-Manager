export type PolicyEffect = 'allow' | 'deny'
export type PolicyScope = 'global' | 'node' | 'descendants' | 'self'

export type PolicyOperator =
  | 'equals'
  | 'notEquals'
  | 'in'
  | 'notIn'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'exists'
  | 'equalsField'

export interface PolicyConditionLeaf {
  field: string
  operator: PolicyOperator
  value?: unknown
  valueFrom?: string
}

export interface PolicyConditionAnd {
  and: readonly PolicyCondition[]
}

export interface PolicyConditionOr {
  or: readonly PolicyCondition[]
}

export type PolicyCondition =
  | PolicyConditionLeaf
  | PolicyConditionAnd
  | PolicyConditionOr

export interface CreatePolicyDto {
  name: string
  description?: string
  effect: PolicyEffect
  resource: string
  action: string
  scope?: PolicyScope
  appliesTo?: {
    roleIds?: string[]
    userIds?: string[]
    nodeIds?: string[]
  }
  conditions: PolicyCondition
}