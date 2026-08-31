import { isPickup, findSla } from '../SlasUtils'
import { PICKUP_IN_STORE } from '../../constants'

describe('isPickup', () => {
  it('returns true when given the pickup delivery channel as a plain string', () => {
    expect(isPickup(PICKUP_IN_STORE)).toBe(true)
  })

  it('returns false when given a different delivery channel as a plain string', () => {
    expect(isPickup('delivery')).toBe(false)
  })

  it('returns true when the object carries the pickup channel on deliveryChannel', () => {
    expect(isPickup({ deliveryChannel: PICKUP_IN_STORE })).toBe(true)
  })

  it('returns true when the object carries the pickup channel on selectedDeliveryChannel', () => {
    expect(isPickup({ selectedDeliveryChannel: PICKUP_IN_STORE })).toBe(true)
  })

  it('returns true when the object carries the pickup channel on id', () => {
    expect(isPickup({ id: PICKUP_IN_STORE })).toBe(true)
  })

  it('prefers deliveryChannel over selectedDeliveryChannel and id', () => {
    expect(
      isPickup({
        deliveryChannel: 'delivery',
        selectedDeliveryChannel: PICKUP_IN_STORE,
        id: PICKUP_IN_STORE,
      })
    ).toBe(false)

    expect(
      isPickup({
        deliveryChannel: PICKUP_IN_STORE,
        selectedDeliveryChannel: 'delivery',
        id: 'delivery',
      })
    ).toBe(true)
  })

  it('prefers selectedDeliveryChannel over id when deliveryChannel is absent', () => {
    expect(
      isPickup({
        selectedDeliveryChannel: 'delivery',
        id: PICKUP_IN_STORE,
      })
    ).toBe(false)

    expect(
      isPickup({
        selectedDeliveryChannel: PICKUP_IN_STORE,
        id: 'delivery',
      })
    ).toBe(true)
  })

  it('falls through an empty deliveryChannel to the next populated key', () => {
    // the lookup uses `||`, so an empty string is skipped rather than winning
    expect(
      isPickup({
        deliveryChannel: '',
        selectedDeliveryChannel: PICKUP_IN_STORE,
      })
    ).toBe(true)
  })

  it('returns false for an object with none of the delivery channel keys', () => {
    expect(isPickup({ name: 'Some Pickup Point' })).toBe(false)
  })

  it('returns false for null, undefined and empty string sources', () => {
    expect(isPickup(null)).toBe(false)
    expect(isPickup(undefined)).toBe(false)
    expect(isPickup('')).toBe(false)
  })
})

describe('findSla', () => {
  it('returns the sla whose id matches the pickup point id', () => {
    const pickupPoint = { id: 'store-1' }
    const matchingSla = { id: 'store-1' }
    const li = { slas: [{ id: 'store-2' }, matchingSla] }

    expect(findSla(li, pickupPoint)).toBe(matchingSla)
  })

  it('matches an sla whose id merely CONTAINS the pickup point id', () => {
    // Documents the CURRENT contract: the match is `sla.id.includes(pickupPoint.id)`,
    // a substring test, not an equality test. A pickup point with id '1' therefore
    // matches an sla with id 'store-11'. This is very likely not the intended
    // behaviour — if someone tightens it to an equality check, this test should
    // fail deliberately so the change is a conscious one.
    const pickupPoint = { id: '1' }
    const looselyMatchingSla = { id: 'store-11' }
    const li = { slas: [looselyMatchingSla] }

    expect(findSla(li, pickupPoint)).toBe(looselyMatchingSla)
  })

  it('returns the first sla in the list when several ids contain the pickup point id', () => {
    const pickupPoint = { id: '1' }
    const firstSla = { id: 'store-1' }
    const li = { slas: [firstSla, { id: 'store-1-alt' }] }

    expect(findSla(li, pickupPoint)).toBe(firstSla)
  })

  it('matches through pickupPointId when the sla id does not match', () => {
    const pickupPoint = { id: 'store-9' }
    const matchingSla = { id: 'unrelated-sla', pickupPointId: 'store-9' }
    const li = { slas: [{ id: 'other' }, matchingSla] }

    expect(findSla(li, pickupPoint)).toBe(matchingSla)
  })

  it('matches through pickupPointId when the sla has no id at all', () => {
    // exercises the `sla.id &&` guard: an sla without an id must not throw
    const pickupPoint = { id: 'store-9' }
    const matchingSla = { pickupPointId: 'store-9' }
    const li = { slas: [matchingSla] }

    expect(findSla(li, pickupPoint)).toBe(matchingSla)
  })

  it('skips slas with an undefined id without throwing', () => {
    const pickupPoint = { id: 'store-9' }
    const matchingSla = { id: 'store-9' }
    const li = { slas: [{ id: undefined }, { id: null }, matchingSla] }

    expect(findSla(li, pickupPoint)).toBe(matchingSla)
  })

  it('returns undefined when no sla matches the pickup point', () => {
    const li = { slas: [{ id: 'store-1' }, { pickupPointId: 'store-2' }] }

    expect(findSla(li, { id: 'store-3' })).toBeUndefined()
  })

  it('returns undefined when the item has no slas', () => {
    expect(findSla({ slas: [] }, { id: 'store-1' })).toBeUndefined()
  })
})
