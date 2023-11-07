import Hash from './Hash.js'

interface MapCacheData {
  hash: Hash
  map: Map<string, any>
  string: Hash
}

// Define an interface that includes __data__
interface DataContainer {
  __data__: MapCacheData
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {DataContainer} dataContainer The container object with __data__.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(dataContainer: DataContainer, key: string): any {
  const data = dataContainer.__data__
  return isKeyable(key)
    ? data[typeof key === 'string' ? 'string' : 'hash']
    : data.map
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value: any): boolean {
  const type = typeof value
  return type === 'string'
    || type === 'number'
    || type === 'symbol'
    || type === 'boolean'
    ? value !== '__proto__'
    : value === null
}

class MapCache {
  size: number
  __data__: MapCacheData

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  constructor(entries?: Array<[string, any]>) {
    this.size = 0
    this.__data__ = {
      hash: new Hash([]),
      map: new Map<string, any>(),
      string: new Hash([]),
    }

    if (entries) {
      for (const [key, value] of entries)
        this.set(key, value)
    }
  }

  /**
   * Removes all key-value entries from the map.
   *
   * @memberOf MapCache
   */
  clear() {
    this.size = 0
    this.__data__ = {
      hash: new Hash([]),
      map: new Map(),
      string: new Hash([]),
    }
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  delete(key: string): boolean {
    const result = getMapData(this, key).delete(key)
    this.size -= result ? 1 : 0
    return result
  }

  /**
   * Gets the map value for `key`.
   *
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  get(key: string): any {
    return getMapData(this, key).get(key)
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  has(key: string): boolean {
    return getMapData(this, key).has(key)
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {object} Returns the map cache instance.
   */
  set(key: string, value: any): object {
    const data = getMapData(this, key)
    const size = data.size

    data.set(key, value)
    this.size += data.size === size ? 0 : 1
    return this
  }
}

export default MapCache
