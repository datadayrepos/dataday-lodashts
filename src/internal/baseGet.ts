import castPath from './castPath'
import toKey from './toKey'

/**
 * The base implementation of `get` without support for default values.
 *
 * @private
 * @param {Record<string | symbol, any>} object The object to query.
 * @param {Array<any> | string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object: Record<string | symbol, any>, path: Array<any> | string): any {
  path = castPath(path, object)

  let index = 0
  const length = path.length

  while (object != null && index < length)
    object = object[toKey(path[index++])]

  return index && index === length ? object : undefined
}

export default baseGet
