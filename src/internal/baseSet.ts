import isObject from '../isObject'
import assignValue from './assignValue'
import castPath from './castPath'
import isIndex from './isIndex'
import toKey from './toKey'

/**
 * The base implementation of `set`.
 *
 * @private
 * @param {object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {object} Returns `object`.
 */
function baseSet(object: object, path: Array<any> | string, value: any, customizer?: Function): object {
  if (!isObject(object))
    return object

  path = castPath(path, object)

  const length = path.length
  const lastIndex = length - 1

  let index = -1
  let nested = object

  while (nested != null && ++index < length) {
    const key = toKey(path[index])
    let newValue = value

    if (index !== lastIndex) {
      const objValue = nested[key]
      newValue = customizer ? customizer(objValue, key, nested) : undefined
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : isIndex(path[index + 1])
            ? []
            : {}
      }
    }
    assignValue(nested, key, newValue)
    nested = nested[key]
  }
  return object
}

export default baseSet
