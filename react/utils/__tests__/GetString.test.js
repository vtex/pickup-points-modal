import { getPickupSlaString, getPickupGeolocationString } from '../GetString'

describe('getPickupSlaString', () => {
  it('returns an empty string for an empty list', () => {
    expect(getPickupSlaString([])).toBe('')
  })

  it('concatenates id and pickupDistance of a single pickup point', () => {
    expect(getPickupSlaString([{ id: 'store-1', pickupDistance: 2.5 }])).toBe(
      'store-12.5'
    )
  })

  it('concatenates id and pickupDistance of every pickup point in order', () => {
    expect(
      getPickupSlaString([
        { id: 'store-1', pickupDistance: 2.5 },
        { id: 'store-2', pickupDistance: 4 },
      ])
    ).toBe('store-12.5store-24')
  })

  it('discards everything accumulated so far when a pickup point has no id', () => {
    // Documents the CURRENT behaviour: the reducer returns '' when the guard
    // fails, which resets the accumulator instead of skipping the invalid entry.
    // A valid entry followed by an invalid one therefore yields '' rather than
    // the valid entry's fragment. Looks like a latent bug — if it is fixed to
    // skip (return accumulatedString), this test should fail deliberately.
    expect(
      getPickupSlaString([
        { id: 'store-1', pickupDistance: 2.5 },
        { pickupDistance: 4 },
      ])
    ).toBe('')
  })

  it('resumes accumulating after the reset caused by an entry without id', () => {
    expect(
      getPickupSlaString([
        { id: 'store-1', pickupDistance: 2.5 },
        { pickupDistance: 4 },
        { id: 'store-3', pickupDistance: 6 },
      ])
    ).toBe('store-36')
  })

  it('renders a missing pickupDistance as the literal string "undefined"', () => {
    // Current behaviour: only `id` is guarded, so an absent pickupDistance is
    // string-concatenated as 'undefined'.
    expect(getPickupSlaString([{ id: 'store-1' }])).toBe('store-1undefined')
  })
})

describe('getPickupGeolocationString', () => {
  it('returns an empty string for an empty list', () => {
    expect(getPickupGeolocationString([])).toBe('')
  })

  it('concatenates the first coordinate of a single geolocation', () => {
    expect(getPickupGeolocationString([[-46.6, -23.5]])).toBe('-46.6')
  })

  it('concatenates the first coordinate of every geolocation in order', () => {
    expect(
      getPickupGeolocationString([
        [-46.6, -23.5],
        [-43.2, -22.9],
      ])
    ).toBe('-46.6-43.2')
  })

  it('discards everything accumulated so far when a geolocation is empty', () => {
    // Same latent reset as getPickupSlaString: the guard's else branch returns
    // '' and wipes the accumulator instead of skipping the empty geolocation.
    expect(getPickupGeolocationString([[-46.6, -23.5], []])).toBe('')
  })

  it('resumes accumulating after the reset caused by an empty geolocation', () => {
    expect(
      getPickupGeolocationString([[-46.6, -23.5], [], [-43.2, -22.9]])
    ).toBe('-43.2')
  })
})
