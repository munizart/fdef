const R = require('ramda')

const funcs = {}

const checkAll = R.pipe(
    R.zip,
    R.map(
        R.converge(R.or, [R.tryCatch(R.apply(R.is), R.F), R.apply(R.equals)])
    ),
    R.reduce(R.and, true),
)

const apply = name => (...args) => {
    if (Array.isArray(funcs[name])) {
        const [, f] = funcs[name].find(([types]) => checkAll(types, args)) || []
        if (f) {
            return f(...args)
        } else {
            throw new TypeError(`No definitions for ${name}${args.join(' ')}`)
        }
    } else {
        throw new TypeError(`No definitions for ${name}`)
    }
}

const fdef = ([name], ...types) => {
    const funs = funcs[name] || []
    return fn => {
        if (typeof fn === 'function') {
            funcs[name] = [...funs, [types, fn]]
            return apply(name)
        } else {
            throw new TypeError('You must implement a function for def ` + name + `')
        }
    }
}

module.exports = fdef