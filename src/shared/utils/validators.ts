




export const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export const isStrongEnoughPassword = (value: string): boolean => {
  return typeof value === 'string' && value.length >= 6
}



export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0
}

export const toPositiveInt = (value: unknown, defaultValue: number) => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : defaultValue
}