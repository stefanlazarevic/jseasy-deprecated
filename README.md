# JSEASY
### Minimal functional library to speed up most common tasks.

Version | Author | Linkedin | email | Website  (in development)
--------|--------|----------|--------|--------
0.5.0 | Stefan Lazarevic | https://www.linkedin.com/in/stefan-lazarevic/|stefanlazarevic.contact@gmail.com| http://www.jseasy.org/

JSEasy library is made from two smaller libraries. Validation library called is and function library called jse.

## Documentation
<hr>

### IS library

#### Type checkers

```javascript
    is.array :: (mix) => boolean
    is.string :: (mix) => boolean
    is.regexp :: (mix) => boolean
    is.undefined :: (mix) => boolean
    is.null :: (mix) => boolean
    is.boolean :: (mix) => boolean
    is.function :: (mix) => boolean
    is.date :: (mix) => boolean
    is.htmlElement :: (mix) => boolean
    is.object :: (mix) => boolean
    is.NaN :: (mix) => boolean
    is.number :: (mix) => boolean
    is.integer :: (mix) => boolean
    is.float :: (mix) => boolean
```

#### Number checkers

```javascript
    is.odd :: (mix) => boolean
    is.even :: (mix) => boolean
    is.positive :: (mix) => boolean
    is.negative :: (mix) => boolean
    is.zero :: (mix) => boolean
    is.positiveZero :: (mix) => boolean
    is.negativeZero :: (mix) => boolean
    is.min :: (mix, mix) => boolean
    is.max :: (mix, mix) => boolean
    is.inNumberRange :: (mix, mix, mix) => boolean
    is.inNumberRangeIncluding :: (mix, mix, mix) => boolean
```

#### Credit Card checkers

```javascript
    is.creditCard :: (mix) => boolean
    is.americanExpress :: (mix) => boolean
    is.visa :: (mix) => boolean
    is.maestro :: (mix) => boolean
    is.jcb :: (mix) => boolean
    is.dinersClub :: (mix) => boolean
    is.masterCard :: (mix) => boolean
    is.discover :: (mix) => boolean
```

#### Assert checkers

```javascript
    is.something :: (mix) => boolean
    is.truthy :: (mix) => boolean
    is.falsy :: (mix) => boolean
    is.equal :: (mix, mix) => boolean
    is.notEqual :: (mix, mix) => boolean
    is.defined :: (mix) => boolean
    is.notEmpty :: (mix) => boolean
    is.arrayLike :: (mix) => boolean
    is.inArray :: (array, mix) => boolean
```

#### Misc checkers

```javascript
    is.email :: (mix) => boolean
    is.url :: (mix) => boolean
    is.json :: (mix) => boolean
    is.alphaWord :: (mix) => boolean
    is.hexColor :: (mix) => boolean
```

### JSE Library

```javascript
    // Return new array with added element on position 0.
    jse.unshift :: (array, mix) => array

    // Return new array without first element.
    jse.shift :: (array) => array

    // Return new array with added element on last position.
    jse.push :: (array, mix) => array

    // Return new array without last element.
    jse.pop :: (array) => array

    // Return duplicate free version of array
    jse.unique :: (array) => array

    // Validate if every element in array meets provided condition.
    jse.every :: (function, array) => boolean

    // Return an array of all the values that pass a predicate test.
    jse.filter :: (function, array) => array

    // Return new array with modified items from original array.
    jse.map :: (function, array) => array

    // Linear search for item in array. Return item if found.
    jse.find :: (function, array) => mix

    // Extract a property value of an object.
    jse.pluck :: (key, object) => mix

    // Functional switch / if else replacement
    jse.match :: (mix) => Object

    // Removes leading and trailing whitespaces from a string.
    jse.trim :: (string) => string

    // Function composition is the process of combining two or more functions
    // to produce new function.
    jse.compose ::

    // currying refers to the process of transforming a function with multiple arity
    // into the same function with less arity.
    jse.curry ::

    // Iterate through array or array like object
    // and execute callback function within each
    // iteration with arguments:
    jse.each :: (function, array) => void

    // Iterate backwards through array or array like object
    // and execute callback function within each
    // iteration with arguments:
    jse.eachR :: (function, array) => void

    // Returns type of provided value.
    jse.type :: (mix) => string

    // Convert ArrayLike object to Array.
    jse.toArray :: (object) => array

    // Return copy of existing array.
    jse.copyArray :: (array) => array

    // Convert string to representing number.
    jse.stringToNumber :: (string) => number

    // Convert any value to a string.
    jse.toString :: (mix) => string

    // Retrieve all the names of the object's own enumerable properties.
    jse.keys :: (mix) => array

    // Create function wrapper to prevent more then one execution.
    jse.once :: (function) => function

    // Try catch function wrapper.
    jse.couldFail :: (function) => void
```
