import { capitalize } from './capitalize';

describe('capitalize function', () => {
    test('capitalizes a lowercase word', () => {
        expect(capitalize('hello')).toBe('Hello');
    });

    test('keeps an already capitalized word unchanged', () => {
        expect(capitalize('Odin')).toBe('Odin');
    });

    test('handles a single character', () => {
        expect(capitalize('a')).toBe('A');
    });

    test('handles an empty string gracefully', () => {
        expect(capitalize('')).toBe('');
    });
});