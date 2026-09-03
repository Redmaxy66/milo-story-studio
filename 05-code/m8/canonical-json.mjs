const unsupported = (path, detail) => new TypeError(`${path}: ${detail}`);

function compareCodePoints(a, b) {
  const aa = Array.from(a, c => c.codePointAt(0));
  const bb = Array.from(b, c => c.codePointAt(0));
  for (let i = 0; i < Math.min(aa.length, bb.length); i += 1) {
    if (aa[i] !== bb[i]) return aa[i] - bb[i];
  }
  return aa.length - bb.length;
}

function encode(value, path, ancestors) {
  if (value === null) return 'null';
  if (typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw unsupported(path, 'non-finite number');
    if (!Number.isSafeInteger(value)) throw unsupported(path, 'numbers must be safe integers; use canonical decimal strings for cost values');
    return JSON.stringify(value);
  }
  if (['undefined', 'function', 'symbol', 'bigint'].includes(typeof value)) throw unsupported(path, `unsupported ${typeof value}`);
  if (typeof value !== 'object') throw unsupported(path, `unsupported ${typeof value}`);
  if (ancestors.has(value)) throw unsupported(path, 'cyclic value');
  ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i += 1) if (!Object.hasOwn(value, i)) throw unsupported(`${path}[${i}]`, 'sparse array');
      return `[${value.map((item, i) => encode(item, `${path}[${i}]`, ancestors)).join(',')}]`;
    }
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) throw unsupported(path, 'only plain objects are supported');
    const keys = Object.keys(value).sort(compareCodePoints);
    return `{${keys.map(key => `${JSON.stringify(key)}:${encode(value[key], `${path}.${key}`, ancestors)}`).join(',')}}`;
  } finally {
    ancestors.delete(value);
  }
}

export function canonicalJson(value) {
  return encode(value, '$', new Set());
}

export {compareCodePoints};
