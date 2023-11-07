import MapCache from './MapCache'

/** Used to stand-in for `undefined` hash values. */
const HASH_UNDEFINED = '__lodash_hash_undefined__'

class SetCache {
  __data__: MapCache
  /**
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */
  constructor(values?: any[]) {
    this.__data__ = new MapCache([])
    if (values != null) {
      let index = -1
      const length = values.length
      while (++index < length)
        this.add(values[index])
    }
  }

  /**
   * Adds `value` to the array cache.
   *
   * @memberOf SetCache
   * @alias push
   * @param {*} value The value to cache.
   * @returns {SetCache} Returns the cache instance.
   */
  add(value: any): SetCache {
    this.__data__.set(value, HASH_UNDEFINED)
    return this
  }

  /**
   * Checks if `value` is in the array cache.
   *
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {boolean} Returns `true` if `value` is found, else `false`.
   */
  has(value: any): boolean {
    return this.__data__.has(value)
  }

  /**
   * Adds `value` to the array cache (alias for add).
   *
   * @memberOf SetCache
   * @param {*} value The value to cache.
   * @returns {SetCache} Returns the cache instance.
   */
  push(value: any): SetCache {
    return this.add(value)
  }
}

export default SetCache
