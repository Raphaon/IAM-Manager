import { AuthTokenService } from './auth.tokens'

describe('AuthTokenService', () => {
  it('should hash token deterministically', () => {
    const token = 'abc123'
    const hash1 = AuthTokenService.hashToken(token)
    const hash2 = AuthTokenService.hashToken(token)

    expect(hash1).toBe(hash2)
  })
})