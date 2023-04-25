import core from '../src/core.js'

describe('Subtract', () => {
    test('Deberia 2 - 2 = 0', () => {
        expect(core.sub(2, 2)).toBe(0); 
    })

    test('Deberia 6 - 4 = 2', () => {
        expect(core.sub(6, 4)).toBe(2); 
    })
})

describe('Addition', () => {
    test('Deberia 0 + 2 = 2', () => {
        expect(core.add(0, 2)).toBe(2); 
    })

    test('Deberia 6 + 4 = 10', () => {
        expect(core.add(6, 4)).toBe(10); 
    })
    test('Deberia -4 + 4 = 0', () => {
        expect(core.add(-4, 4)).toBe(0); 
    })
    test('Deberia -4 + 8 = 0', () => {
        expect(core.add(-4, 8)).toBe(4); 
    })
})