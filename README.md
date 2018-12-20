# fdef
Define functions using haskell-like syntax

## Usage example
(see it live at https://runkit.com/munizart/5bfef7ba07b85400123ee291)

```javascript
const fdef = require('fdef')
const def = fdef('myNamespace')

const fib =
  def `fib ${0}` (() => 1)
  def `fib ${1}` (() => 1)
  def `fib ${Number}` (n => fib (n - 1) + fib (n - 2))

const fisrt10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(fib)
console.log(fisrt10) // [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
```

## Documetation

### **`fdef`** :: ( namespace: *String* ) => *DefTemplateTag*
`fdef` take a namespace and returns a `def` template tag used to define functions.

### **DefTemplateTag (`def`)** :: ([name: *String*], types: ...*Contructors*) => *((...Constructors) => a) => Function*
```javascript
def `identifier ${TypeConstructor1} ${TypeConstructor2}` ((instanceOfType1, instanceOfType1) => {...})
```

Defines a implementation for `identifier` that matches positional arguments withing type constructors

### **DefTemplateTag (`def`)** :: ([name: *String*], types: ...*Contructors*) => *((...LiteralValues) => a) => Function*
```javascript
def `identifier ${0} ${1}` ((zero, one) => {...})
```

Defines a implementation for `identifier` that matches the first param being `0` and the second being `1`.

### **DefTemplateTag (`def`)** :: ([name: *String*], types: ...*Contructors*) => *((...LiteralValues | Constructors) => a) => Function*
```javascript
def `identifier ${0} ${TypeConstructor2}` ((instanceOfType1, instanceOfType1) => {...})
```

Defines a implementation for `identifier` that matches the first param being `0` and the second being any instance of `TypeConstructor2`.

