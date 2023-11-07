/**
 * Creates a clone of `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer: ArrayBuffer, isDeep: boolean): ArrayBuffer {
  if (isDeep)
    return buffer.slice(0)

  // Assuming we have a method to create an ArrayBuffer of the same length.
  const result = new ArrayBuffer(buffer.byteLength)

  // Now we have to copy the contents of `buffer` to `result`.
  // Here we use a new Uint8Array as a view for the copying operation.
  new Uint8Array(result).set(new Uint8Array(buffer))

  return result
}

export default cloneBuffer
