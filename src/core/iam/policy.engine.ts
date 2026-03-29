import { PolicyCondition, PolicyConditionLeaf } from '../../types/policy.types'
import { PolicyEvaluationContext } from '../../types/context.types'

export class PolicyEngine {
  static evaluate(
    condition: PolicyCondition,
    evaluationContext: PolicyEvaluationContext
  ): boolean {
    if ('and' in condition) {
      return condition.and.every((child) =>
        this.evaluate(child, evaluationContext)
      )
    }

    if ('or' in condition) {
      return condition.or.some((child) =>
        this.evaluate(child, evaluationContext)
      )
    }

    return this.evaluateLeaf(condition, evaluationContext)
  }

  private static evaluateLeaf(
    condition: PolicyConditionLeaf,
    evaluationContext: PolicyEvaluationContext
  ): boolean {
    const actualValue = this.getValueByPath(evaluationContext, condition.field)
    const expectedValue =
      condition.valueFrom !== undefined
        ? this.getValueByPath(evaluationContext, condition.valueFrom)
        : condition.value

    switch (condition.operator) {
      case 'equals':
        return actualValue === expectedValue

      case 'notEquals':
        return actualValue !== expectedValue

      case 'in':
        return Array.isArray(expectedValue) && expectedValue.includes(actualValue)

      case 'notIn':
        return Array.isArray(expectedValue) && !expectedValue.includes(actualValue)

      case 'gt':
        return typeof actualValue === 'number' &&
          typeof expectedValue === 'number' &&
          actualValue > expectedValue

      case 'gte':
        return typeof actualValue === 'number' &&
          typeof expectedValue === 'number' &&
          actualValue >= expectedValue

      case 'lt':
        return typeof actualValue === 'number' &&
          typeof expectedValue === 'number' &&
          actualValue < expectedValue

      case 'lte':
        return typeof actualValue === 'number' &&
          typeof expectedValue === 'number' &&
          actualValue <= expectedValue

      case 'exists':
        return expectedValue ? actualValue !== undefined : actualValue === undefined

      case 'equalsField':
        return actualValue === expectedValue

      default:
        return false
    }
  }

  private static getValueByPath(obj: unknown, path: string): unknown {
    if (!obj || !path) {
      return undefined
    }

    return path.split('.').reduce((acc: any, part) => {
      if (acc === undefined || acc === null) {
        return undefined
      }
      return acc[part]
    }, obj as any)
  }
}