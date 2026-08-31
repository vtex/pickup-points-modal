export default function memoizeOne(resultFn) {
  let lastArgs = null
  let lastResult

  return (...args) => {
    const isSameArgs =
      lastArgs !== null &&
      lastArgs.length === args.length &&
      args.every((arg, index) => arg === lastArgs[index])

    if (isSameArgs) {
      return lastResult
    }

    lastArgs = args
    lastResult = resultFn(...args)

    return lastResult
  }
}
