import freeGlobal from './freeGlobal'

/** Detect free variable `globalThis` */
const freeGlobalThis
  = typeof globalThis === 'object'
  && globalThis !== null
  && globalThis.Object === Object
  && globalThis

/** Detect free variable `self`. */
/* eslint-disable no-restricted-globals -- Preserve the legacy browser/worker global fallback. */
const freeSelf
  = typeof self === 'object' && self !== null && self.Object === Object && self
/* eslint-enable no-restricted-globals */

/** Used as a reference to the global object. */
const root
  // eslint-disable-next-line no-new-func -- Retain the existing last-resort global lookup for legacy runtimes.
  = freeGlobalThis || freeGlobal || freeSelf || Function('return this')()

export default root
