import isObject from '../isObject.js'
import keysIn from '../keysIn.js'
import Stack from './Stack.js'
import assignMergeValue from './assignMergeValue'
import baseFor from './baseFor'
import baseMergeDeep from './baseMergeDeep'

/**
 * The base implementation of `merge` without support for multiple sources.
 *
 * @private
 * @param {object} object The destination object.
 * @param {object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object: object, source: object, srcIndex: number, customizer: Function, stack: object) {
  if (object === source)
    return

  baseFor(source, (srcValue, key) => {
    if (isObject(srcValue)) {
      stack || (stack = new Stack())
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack)
    }
    else {
      let newValue = customizer
        ? customizer(object[key], srcValue, `${key}`, object, source, stack)
        : undefined

      if (newValue === undefined)
        newValue = srcValue

      assignMergeValue(object, key, newValue)
    }
  }, keysIn)
}

export default baseMerge
