const R = require('ramda')

function fdef ( namespace ) {
  const funcs = {}

  const checkAll = R.pipe(
      R.zip,
      R.map(
          R.converge(R.unapply(R.any(R.identity)), [
            R.tryCatch(R.apply(R.is), R.F),
            R.apply(R.equals),
            R.compose(R.equals('*'), R.tryCatch(R.trim, R.always('')), R.head)
          ])
      ),
      R.reduce(R.and, true),
  )

  const apply = name => (...args) => {
      if (Array.isArray(funcs[name])) {
          const [, f] = funcs[name].find(([types]) => checkAll(types, args)) || []
          if (f) {
              return f(...args)
          } else {
              throw new TypeError(`No definitions for ${namespace}.${name} ${args.join(' ')}`)
          }
      } else {
          throw new TypeError(`No definitions for ${namespace}.${name}`)
      }
  }

  return ([definition], ...types) => {
      const [name, asterix] = String(definition).trim().split(' ')
      const funs = funcs[name] || []

      if (!types.length && /^\s*\*\s*$/.test(asterix)) {
        types = ['*']
      }

      return fn => {
          if (typeof fn === 'function') {
              funcs[name] = [...funs, [types, fn]]
              return apply(name)
          } else {
              throw new TypeError(`You must implement a function for def ${name}`)
          }
      }
  }

}

module.exports = fdef