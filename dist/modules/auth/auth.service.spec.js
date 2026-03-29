"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_tokens_1 = require("./auth.tokens");
describe('AuthTokenService', () => {
    it('should hash token deterministically', () => {
        const token = 'abc123';
        const hash1 = auth_tokens_1.AuthTokenService.hashToken(token);
        const hash2 = auth_tokens_1.AuthTokenService.hashToken(token);
        expect(hash1).toBe(hash2);
    });
});
