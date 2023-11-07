import cloneArrayBuffer from './cloneArrayBuffer'

export interface CloneableTypedArray {
  buffer: ArrayBuffer
  byteOffset: number
  length: number
  constructor: new (buffer: ArrayBuffer, byteOffset: number, length: number) => any
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray: CloneableTypedArray, isDeep: boolean): any {
  const buffer = isDeep
    ? cloneArrayBuffer(typedArray.buffer)
    : typedArray.buffer
  return new typedArray.constructor(
    buffer,
    typedArray.byteOffset,
    typedArray.length,
  )
}

export default cloneTypedArray
