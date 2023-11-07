import setToArray from './setToArray'

/** Used as references for various `Number` constants. */
const NEGATIVE_INFINITY = -1 / 0

/**
 * Checks if the JavaScript environment supports the Set object correctly,
 * particularly with handling -0 and +0 as distinct values.
 *
 * If a Set object does not exist or does not handle -0 correctly,
 * a fallback object mimicking the basic functionality of a Set is returned.
 */
const createSet = (typeof Set === 'function' && 1 / setToArray(new Set([undefined, -0]))[1] === NEGATIVE_INFINITY)
  ? (values: Iterable<unknown> | null | undefined) => new Set(values)
  : () => {
    // Fallback object that mimics a Set
      let collection: any[] = []
      return {
        add: (value: any) => {
          if (!collection.includes(value))
            collection.push(value)
        },
        clear: () => { collection = [] },
        delete: (value: any) => {
          const index = collection.indexOf(value)
          if (index > -1) {
            collection.splice(index, 1)
            return true
          }
          return false
        },
        has: (value: any) => collection.includes(value),
      }
    }

export default createSet
