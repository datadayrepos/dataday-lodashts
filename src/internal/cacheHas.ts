interface CacheType {
  has(key: string): boolean
  // any other methods or properties needed
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {CacheType} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache: CacheType, key: string): boolean {
  return cache.has(key)
}

export default cacheHas
