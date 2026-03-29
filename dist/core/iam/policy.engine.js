"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyEngine = void 0;
class PolicyEngine {
    static evaluate(condition, evaluationContext) {
        if ('and' in condition) {
            return condition.and.every((child) => this.evaluate(child, evaluationContext));
        }
        if ('or' in condition) {
            return condition.or.some((child) => this.evaluate(child, evaluationContext));
        }
        return this.evaluateLeaf(condition, evaluationContext);
    }
    static evaluateLeaf(condition, evaluationContext) {
        const actualValue = this.getValueByPath(evaluationContext, condition.field);
        const expectedValue = condition.valueFrom !== undefined
            ? this.getValueByPath(evaluationContext, condition.valueFrom)
            : condition.value;
        switch (condition.operator) {
            case 'equals':
                return actualValue === expectedValue;
            case 'notEquals':
                return actualValue !== expectedValue;
            case 'in':
                return Array.isArray(expectedValue) && expectedValue.includes(actualValue);
            case 'notIn':
                return Array.isArray(expectedValue) && !expectedValue.includes(actualValue);
            case 'gt':
                return typeof actualValue === 'number' &&
                    typeof expectedValue === 'number' &&
                    actualValue > expectedValue;
            case 'gte':
                return typeof actualValue === 'number' &&
                    typeof expectedValue === 'number' &&
                    actualValue >= expectedValue;
            case 'lt':
                return typeof actualValue === 'number' &&
                    typeof expectedValue === 'number' &&
                    actualValue < expectedValue;
            case 'lte':
                return typeof actualValue === 'number' &&
                    typeof expectedValue === 'number' &&
                    actualValue <= expectedValue;
            case 'exists':
                return expectedValue ? actualValue !== undefined : actualValue === undefined;
            case 'equalsField':
                return actualValue === expectedValue;
            default:
                return false;
        }
    }
    static getValueByPath(obj, path) {
        if (!obj || !path) {
            return undefined;
        }
        return path.split('.').reduce((acc, part) => {
            if (acc === undefined || acc === null) {
                return undefined;
            }
            return acc[part];
        }, obj);
    }
}
exports.PolicyEngine = PolicyEngine;
