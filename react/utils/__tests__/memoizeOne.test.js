import memoizeOne from '../memoizeOne'

describe('memoizeOne', () => {
  it('should return the cached result when called with the same arguments', () => {
    const resultFn = jest.fn((a, b) => ({ a, b }))
    const memoized = memoizeOne(resultFn)

    const first = memoized(1, 2)
    const second = memoized(1, 2)

    expect(second).toBe(first)
    expect(resultFn).toHaveBeenCalledTimes(1)
  })

  it('should recompute when any argument changes', () => {
    const resultFn = jest.fn((a, b) => ({ a, b }))
    const memoized = memoizeOne(resultFn)

    const first = memoized(1, 2)
    const second = memoized(1, 3)

    expect(second).not.toBe(first)
    expect(resultFn).toHaveBeenCalledTimes(2)
  })

  it('should recompute on the very first call', () => {
    const resultFn = jest.fn(() => ({}))
    const memoized = memoizeOne(resultFn)

    memoized()

    expect(resultFn).toHaveBeenCalledTimes(1)
  })
})
