/** Detect free variable `global` from Node.js. */
/* eslint-disable no-restricted-globals -- Preserve feature detection on runtimes predating globalThis. */
const freeGlobal
  = typeof global === 'object'
  && global !== null
  && global.Object === Object
  && global
/* eslint-enable no-restricted-globals */

export default freeGlobal
