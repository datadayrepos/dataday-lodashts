import baseGet from './baseGet'
import baseSet from './baseSet'
import castPath from './castPath'

/**
 * The base implementation of `pickBy`.
 *
 * @private
 * @param {object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {object} Returns the new object.
 */
function basePickBy(object: object, paths: string[], predicate: Function): object {
  let index = -1
  const length = paths.length
  const result = {}

  while (++index < length) {
    const path = paths[index]
    const value = baseGet(object, path)
    if (predicate(value, path))
      baseSet(result, castPath(path, object), value)
  }
  return result
}

export default basePickBy
