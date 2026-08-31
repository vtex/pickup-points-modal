import {
  isCurrentChannel,
  isPickup,
  isDelivery,
  getFirstItemWithSelectedDelivery,
} from '../DeliveryChannelsUtils'
import { PICKUP_IN_STORE, DELIVERY } from '../../constants'

describe('isCurrentChannel', () => {
  it('returns true when the source string equals the channel asked for', () => {
    expect(isCurrentChannel(DELIVERY, DELIVERY)).toBe(true)
  })

  it('returns false when the source string is a different channel', () => {
    expect(isCurrentChannel(PICKUP_IN_STORE, DELIVERY)).toBe(false)
  })

  it('reads the channel off deliveryChannel, selectedDeliveryChannel or id', () => {
    expect(isCurrentChannel({ deliveryChannel: DELIVERY }, DELIVERY)).toBe(true)
    expect(
      isCurrentChannel({ selectedDeliveryChannel: DELIVERY }, DELIVERY)
    ).toBe(true)
    expect(isCurrentChannel({ id: DELIVERY }, DELIVERY)).toBe(true)
  })

  it('prefers deliveryChannel over the other two keys', () => {
    expect(
      isCurrentChannel(
        { deliveryChannel: PICKUP_IN_STORE, selectedDeliveryChannel: DELIVERY },
        DELIVERY
      )
    ).toBe(false)
  })

  it('returns false for a source carrying none of the channel keys', () => {
    expect(isCurrentChannel({ name: 'anything' }, DELIVERY)).toBe(false)
  })

  it('returns false for null and undefined sources', () => {
    expect(isCurrentChannel(null, DELIVERY)).toBe(false)
    expect(isCurrentChannel(undefined, DELIVERY)).toBe(false)
  })
})

describe('isPickup', () => {
  it('recognises the pickup channel from a string and from each object key', () => {
    expect(isPickup(PICKUP_IN_STORE)).toBe(true)
    expect(isPickup({ deliveryChannel: PICKUP_IN_STORE })).toBe(true)
    expect(isPickup({ selectedDeliveryChannel: PICKUP_IN_STORE })).toBe(true)
    expect(isPickup({ id: PICKUP_IN_STORE })).toBe(true)
  })

  it('returns false for the delivery channel', () => {
    expect(isPickup(DELIVERY)).toBe(false)
    expect(isPickup({ deliveryChannel: DELIVERY })).toBe(false)
  })
})

describe('isDelivery', () => {
  it('recognises the delivery channel from a string and from each object key', () => {
    expect(isDelivery(DELIVERY)).toBe(true)
    expect(isDelivery({ deliveryChannel: DELIVERY })).toBe(true)
    expect(isDelivery({ selectedDeliveryChannel: DELIVERY })).toBe(true)
    expect(isDelivery({ id: DELIVERY })).toBe(true)
  })

  it('returns false for the pickup channel', () => {
    expect(isDelivery(PICKUP_IN_STORE)).toBe(false)
    expect(isDelivery({ deliveryChannel: PICKUP_IN_STORE })).toBe(false)
  })
})

describe('getFirstItemWithSelectedDelivery', () => {
  it('returns the first logisticsInfo entry set to delivery', () => {
    const firstDelivery = { itemIndex: 1, selectedDeliveryChannel: DELIVERY }
    const logisticsInfo = [
      { itemIndex: 0, selectedDeliveryChannel: PICKUP_IN_STORE },
      firstDelivery,
      { itemIndex: 2, selectedDeliveryChannel: DELIVERY },
    ]

    expect(getFirstItemWithSelectedDelivery(logisticsInfo)).toBe(firstDelivery)
  })

  it('returns undefined when every item is set to pickup', () => {
    const logisticsInfo = [
      { itemIndex: 0, selectedDeliveryChannel: PICKUP_IN_STORE },
      { itemIndex: 1, selectedDeliveryChannel: PICKUP_IN_STORE },
    ]

    expect(getFirstItemWithSelectedDelivery(logisticsInfo)).toBeUndefined()
  })

  it('returns undefined for an empty logisticsInfo', () => {
    expect(getFirstItemWithSelectedDelivery([])).toBeUndefined()
  })

  it('ignores items whose delivery channel has not been selected yet', () => {
    const chosen = { itemIndex: 1, selectedDeliveryChannel: DELIVERY }
    const logisticsInfo = [{ itemIndex: 0 }, chosen]

    expect(getFirstItemWithSelectedDelivery(logisticsInfo)).toBe(chosen)
  })
})
