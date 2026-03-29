export type NodeType =
  | 'organization'
  | 'branch'
  | 'subbranch'
  | 'department'
  | 'team'

export interface CreateNodeDto {
  name: string
  type: NodeType
  parentId?: string | null
}