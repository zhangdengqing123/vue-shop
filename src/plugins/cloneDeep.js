export function cloneDeep(obj, oldObj) {
  obj = obj || {}
  for (const key in oldObj) {
    if (typeof oldObj[key] === 'object') {
      obj[key] = oldObj[key] instanceof Array ? [] : {}
      cloneDeep(obj[key], oldObj[key])
    } else {
      obj[key] = oldObj[key]
    }
  }
  return obj
}
