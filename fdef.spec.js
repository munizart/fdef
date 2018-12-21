const { always, compose, converge, equals, flip, identity, length, multiply, unapply } = require ('ramda')
const fc = require ('fast-check')
const fdef = require ('./fdef')

const eq = unapply (converge (equals))
const makeTest = f => v => eq (f, always (v))

describe ('fdef', () => {

    let def = fdef ('test')

    beforeEach (() => {
        def = fdef ('test')
    })

    it ('Should returns a function', () => {
        expect (def `testFn`)
            .toBeInstanceOf (Function)
    })

    it ('Returned function also should return a function', () => {
        expect (def `id *` (identity))
            .toBeInstanceOf (Function)
    })

    it ('Should match anything with *', () => {
        const id = def `id *` (identity)
        fc.assert (fc.property (
            fc.anything (),
            eq (identity, id)
        ))

        const double = def `double *` (x => x+x)
        fc.assert (fc.property (
            fc.nat (),
            eq (multiply (2), double)
        ))

    })

    it ('Should match by type constructor', () => {
        const f =
            def `f ${String}`  (always ('string'))
            def `f ${Number}`  (always ('number'))
            def `f ${Boolean}` (always ('boolean'))
            def `f *`          (always ('otherwise'))


        const test = makeTest (f)

        fc.assert (fc.property (fc.boolean (), b => f (b) === 'boolean'))

        fc.assert (fc.property (fc.string (), test ('string')))

        fc.assert (fc.property (fc.float (), test ('number')))
        fc.assert (fc.property (fc.integer (), test ('number')))
        fc.assert (fc.property (fc.nat (), test ('number')))

        fc.assert (fc.property (fc.object (), test ('otherwise')))
    })

    it ('should match any number of params', () => {
        const countParams = unapply (length)

        const arity =
            def `arity ${Number}` (always ('number'))
            def `arity *` (countParams)
            def `arity * ${Number}` (always ('number'))
            def `arity * *` (countParams)
            def `arity * * *` (countParams)
            def `arity * * * *` (countParams)
            def `arity * * * * *` (countParams)

        const test = makeTest (arity)

        fc.assert (fc.property (
            fc.string (),
            test (1)
        ))

        fc.assert (fc.property (
            fc.string (),
            fc.string (),
            test (2)
        ))

        fc.assert (fc.property (
            fc.string (),
            fc.string (),
            fc.string (),
            test (3)
        ))

        fc.assert (fc.property (
            fc.string (),
            fc.string (),
            fc.string (),
            fc.string (),
            test (4)
        ))

        fc.assert (fc.property (
            fc.string (),
            fc.string (),
            fc.string (),
            fc.string (),
            fc.string (),
            test (5)
        ))

        fc.assert (fc.property (
            fc.nat (),
            test ('number')
        ))

        fc.assert (fc.property (
            fc.anything (),
            fc.nat (),
            flip (test ('number'))
        ))
    })
})