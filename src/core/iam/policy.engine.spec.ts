import { PolicyEngine } from './policy.engine'

describe('PolicyEngine', () => {
  it('should return true for equalsField when values match', () => {
    const condition = {
      field: 'resource.ownerId',
      operator: 'equalsField',
      valueFrom: 'user.userId'
    } as const

    const context = {
      user: {
        userId: 'user-1'
      },
      resource: {
        ownerId: 'user-1'
      },
      context: {}
    }

    const result = PolicyEngine.evaluate(condition, context as any)
    expect(result).toBe(true)
  })

  it('should return false when deny condition does not match', () => {
    const condition = {
      field: 'resource.classification',
      operator: 'equals',
      value: 'confidential'
    } as const

    const context = {
      user: {
        userId: 'user-1'
      },
      resource: {
        classification: 'public'
      },
      context: {}
    }

    const result = PolicyEngine.evaluate(condition, context as any)
    expect(result).toBe(false)
  })

  it('should evaluate and/or trees', () => {
    const condition = {
      and: [
        {
          field: 'resource.amount',
          operator: 'gte',
          value: 1000
        },
        {
          or: [
            {
              field: 'resource.status',
              operator: 'equals',
              value: 'active'
            },
            {
              field: 'resource.status',
              operator: 'equals',
              value: 'pending'
            }
          ]
        }
      ]
    } as const

    const context = {
      user: {
        userId: 'user-1'
      },
      resource: {
        amount: 1200,
        status: 'active'
      },
      context: {}
    }

    const result = PolicyEngine.evaluate(condition, context as any)
    expect(result).toBe(true)
  })
})