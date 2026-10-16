import { describe, expect, it } from 'vitest'
import { formatMessageTime } from './format-message-time'

describe('formatMessageTime', () => {
    it('shows hours and minutes', () => {
        expect(formatMessageTime('2026-02-12T19:05:00+01:00')).toBe('19:05')
    })

    it('uses Norwegian time regardless of the input time zone', () => {
        expect(formatMessageTime('2026-02-12T18:05:00Z')).toBe('19:05')
    })
})