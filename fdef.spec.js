const { always, converge, equals, identity, multiply, unapply } = require('ramda')
const fc = require('fast-check')
const fdef = require('./fdef')

const eq = unapply(converge(equals))

describe('fdef', () => {
    it('Should returns a function', () => {
        expect(fdef `testFn`).toBeInstanceOf(Function)
    })

    it('Returned function also should return a function', () => {
        expect(fdef `id` (identity)).toBeInstanceOf(Function)
    })

    it('Should match anything with *', () => {
        const id = fdef `id *` (identity)
        fc.assert(fc.property(
            fc.anything(),
            eq(identity, id)
        ))
        
        const double = fdef `double *` (x => x+x)
        fc.assert(fc.property(
            fc.nat(),
            eq(multiply(2), double)
        ))

    })

    it('Should match by type constructor', () => {
        const f = 
            fdef `f ${String}`  (always('string'))
            fdef `f ${Number}`  (always('number'))
            fdef `f ${Boolean}` (always('boolean'))
            fdef `f *`          (always('otherwise'))

        const test = v => eq(f, always(v))

        fc.assert(fc.property(fc.boolean(), b => f(b) === 'boolean'))

        fc.assert(fc.property(fc.string(), test('string')))
        
        fc.assert(fc.property(fc.float(), test('number')))
        fc.assert(fc.property(fc.integer(), test('number')))
        fc.assert(fc.property(fc.nat(), test('number')))

        fc.assert(fc.property(fc.object(), test('otherwise')))        
    })
})