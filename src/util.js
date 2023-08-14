
import { FLOAT, INT } from "./const.js"

// show error meaningfully
export function err(msg) {
  // Promise.resolve().then(() => {
  throw Error((msg || 'Bad syntax'))
  // })
}

// collect ids used within node
export function ids(node, set=new Set) {
  if (node?.ids) return node.ids
  if (typeof node === 'string') set.add(node)
  else if (Array.isArray(node)) {
    // 1k, 1.2 - just ignore
    if (node[0]===INT || node[0]===FLOAT) return

    // f(x) = (...ignore...)
    if (node[0]==='='&&node[1][0]==='()') return set.add(node[1][1]), set

    // ignore[ignore]
    // if (node[0]==='[]') return set

    // for each child - collect ids within it
    for (let i = 1; i < node.length; i++) ids(node[i], set)
    node.ids = set
  }
  return set
}

// test if 2 sets have common members
export function intersect(set1, set2) {
  for (const item of set1) if (set2.has(item)) return true;
  return false;
}

export function stringify(str) {
  if (typeof str === 'string') return str
  let [op, a, ...args] = str
  if (op === INT || op === FLOAT) return a+args.join('')
  return `${stringify(a)} ${op} ${args.length ? stringify(args[0]) : ''}`
}

// uint8 array to string
export function u82s(uint8Array) {
  let result = '';
  for (const byte of uint8Array) {
      // Convert uint8 value to its ASCII character equivalent
      const asciiChar = String.fromCharCode(byte);
      // Handle special characters that need escaping
      if (asciiChar === '"' || asciiChar === '\\') {
          result += '\\' + asciiChar;
      } else if (byte >= 32 && byte <= 126) {
          result += asciiChar; // Regular printable ASCII characters
      } else {
          result += `\\${byte.toString(16).padStart(2,'0')}`; // Non-printable characters
      }
  }
  return result;
}