import {
  getUnavailableItemsAmount,
  getUnavailableItemsByPickup,
  getItemsWithPickupPoint,
  getPickupOptionGeolocations,
  getPickupPointGeolocations,
  getPickupOptions,
  getUniquePickupPoints,
} from '../pickupUtils'
import { PICKUP_IN_STORE, DELIVERY } from '../../constants'

const pickupSla = (id, price = 0) => ({
  id,
  deliveryChannel: PICKUP_IN_STORE,
  price,
})

const deliverySla = (id) => ({ id, deliveryChannel: DELIVERY })

describe('getUnavailableItemsByPickup', () => {
  const items = [{ seller: '1' }, { seller: '1' }]

  it('returns an empty list when no pickup point is given', () => {
    expect(getUnavailableItemsByPickup(items, [], null)).toEqual([])
    expect(getUnavailableItemsByPickup(items, [], undefined)).toEqual([])
  })

  it('lists the items whose logisticsInfo does not offer the pickup point', () => {
    const logisticsInfo = [
      { itemIndex: 0, slas: [pickupSla('store-1')] },
      { itemIndex: 1, slas: [pickupSla('store-2')] },
    ]

    expect(
      getUnavailableItemsByPickup(items, logisticsInfo, { id: 'store-1' })
    ).toEqual([items[1]])
  })

  it('returns an empty list when every item offers the pickup point', () => {
    const logisticsInfo = [
      { itemIndex: 0, slas: [pickupSla('store-1')] },
      { itemIndex: 1, slas: [pickupSla('store-1')] },
    ]

    expect(
      getUnavailableItemsByPickup(items, logisticsInfo, { id: 'store-1' })
    ).toEqual([])
  })

  it('treats an item with no matching logisticsInfo entry as unavailable', () => {
    const logisticsInfo = [{ itemIndex: 0, slas: [pickupSla('store-1')] }]

    expect(
      getUnavailableItemsByPickup(items, logisticsInfo, { id: 'store-1' })
    ).toEqual([items[1]])
  })

  it('accepts the pickup point as a bare id string', () => {
    const logisticsInfo = [
      { itemIndex: 0, slas: [pickupSla('store-1')] },
      { itemIndex: 1, slas: [pickupSla('store-2')] },
    ]

    expect(
      getUnavailableItemsByPickup(items, logisticsInfo, 'store-1')
    ).toEqual([items[1]])
  })

  it('only considers items belonging to the given seller', () => {
    const mixedItems = [{ seller: '1' }, { seller: '2' }]
    const logisticsInfo = [
      { itemIndex: 0, slas: [pickupSla('store-2')] },
      { itemIndex: 1, slas: [pickupSla('store-2')] },
    ]

    expect(
      getUnavailableItemsByPickup(
        mixedItems,
        logisticsInfo,
        { id: 'store-1' },
        '2'
      )
    ).toEqual([mixedItems[1]])
  })
})

describe('getUnavailableItemsAmount', () => {
  it('counts the unavailable items', () => {
    const items = [{ seller: '1' }, { seller: '1' }]
    const logisticsInfo = [
      { itemIndex: 0, slas: [pickupSla('store-1')] },
      { itemIndex: 1, slas: [pickupSla('store-2')] },
    ]

    expect(
      getUnavailableItemsAmount(items, logisticsInfo, { id: 'store-1' })
    ).toBe(1)
  })

  it('returns zero when no pickup point is given', () => {
    expect(getUnavailableItemsAmount([], [], null)).toBe(0)
  })
})

describe('getItemsWithPickupPoint', () => {
  const items = [{ seller: '1' }, { seller: '1' }]

  it('returns an empty list when no pickup point is given', () => {
    expect(getItemsWithPickupPoint(items, [], null)).toEqual([])
  })

  it('lists only the items whose logisticsInfo offers the pickup point', () => {
    const logisticsInfo = [
      { itemIndex: 0, slas: [pickupSla('store-1')] },
      { itemIndex: 1, slas: [pickupSla('store-2')] },
    ]

    expect(
      getItemsWithPickupPoint(items, logisticsInfo, { id: 'store-1' })
    ).toEqual([items[0]])
  })

  it('excludes items with no matching logisticsInfo entry', () => {
    const logisticsInfo = [{ itemIndex: 0, slas: [pickupSla('store-1')] }]

    expect(
      getItemsWithPickupPoint(items, logisticsInfo, { id: 'store-1' })
    ).toEqual([items[0]])
  })

  it('is the complement of getUnavailableItemsByPickup for a single seller', () => {
    const logisticsInfo = [
      { itemIndex: 0, slas: [pickupSla('store-1')] },
      { itemIndex: 1, slas: [pickupSla('store-2')] },
    ]

    const withPickup = getItemsWithPickupPoint(items, logisticsInfo, {
      id: 'store-1',
    })

    const without = getUnavailableItemsByPickup(items, logisticsInfo, {
      id: 'store-1',
    })

    expect(withPickup.length + without.length).toBe(items.length)
  })
})

describe('getPickupOptionGeolocations', () => {
  const coords = [-46.6, -23.5]
  const option = {
    pickupStoreInfo: { address: { geoCoordinates: coords } },
  }

  it('maps a list of pickup options to their coordinates', () => {
    expect(getPickupOptionGeolocations([option, option])).toEqual([
      coords,
      coords,
    ])
  })

  it('yields undefined for entries missing the nested address', () => {
    expect(getPickupOptionGeolocations([option, {}])).toEqual([
      coords,
      undefined,
    ])
  })

  it('preserves a null entry rather than throwing on it', () => {
    expect(getPickupOptionGeolocations([null, option])).toEqual([null, coords])
  })

  it('reads the coordinates of a single pickup option passed on its own', () => {
    expect(getPickupOptionGeolocations(option)).toEqual(coords)
  })

  it('returns the falsy input untouched when there is no pickup option', () => {
    expect(getPickupOptionGeolocations(null)).toBeNull()
    expect(getPickupOptionGeolocations(undefined)).toBeUndefined()
  })

  it('returns an empty list for an empty list of options', () => {
    expect(getPickupOptionGeolocations([])).toEqual([])
  })
})

describe('getPickupPointGeolocations', () => {
  const coords = [-46.6, -23.5]
  const pickupPoint = { address: { geoCoordinates: coords } }

  it('maps a list of pickup points to their coordinates', () => {
    expect(getPickupPointGeolocations([pickupPoint, pickupPoint])).toEqual([
      coords,
      coords,
    ])
  })

  it('reads the coordinates of a single pickup point passed on its own', () => {
    expect(getPickupPointGeolocations(pickupPoint)).toEqual(coords)
  })

  it('yields undefined for a pickup point with no address', () => {
    expect(getPickupPointGeolocations([{}])).toEqual([undefined])
  })

  it('returns the falsy input untouched when there is no pickup point', () => {
    expect(getPickupPointGeolocations(null)).toBeNull()
    expect(getPickupPointGeolocations(undefined)).toBeUndefined()
  })
})

describe('getPickupOptions', () => {
  it('returns an empty list when there is no logisticsInfo', () => {
    expect(getPickupOptions(null)).toEqual([])
    expect(getPickupOptions(undefined)).toEqual([])
  })

  it('keeps only the pickup slas and drops the delivery ones', () => {
    const logisticsInfo = [
      { slas: [pickupSla('store-1', 100), deliverySla('normal')] },
    ]

    const options = getPickupOptions(logisticsInfo)

    expect(options).toHaveLength(1)
    expect(options[0].id).toBe('store-1')
  })

  it('de-duplicates a pickup point offered by several items', () => {
    const logisticsInfo = [
      { slas: [pickupSla('store-1', 100)] },
      { slas: [pickupSla('store-1', 50)] },
    ]

    expect(getPickupOptions(logisticsInfo).map((o) => o.id)).toEqual([
      'store-1',
    ])
  })

  it('sums the price of a pickup point across every item that offers it', () => {
    const logisticsInfo = [
      { slas: [pickupSla('store-1', 100)] },
      { slas: [pickupSla('store-1', 50)] },
    ]

    expect(getPickupOptions(logisticsInfo)[0].price).toBe(150)
  })

  it('resets the accumulated price to zero when a later item lacks the pickup point', () => {
    // Documents the CURRENT behaviour. The reducer's else branch returns 0
    // rather than the accumulator, so an item that does not offer the pickup
    // point wipes the total collected so far instead of contributing nothing.
    // Here store-1 costs 100 in the first item and is absent from the second,
    // so the total ends at 0 rather than 100. Looks like a latent bug; if it is
    // fixed to `: accPrice`, this test should fail deliberately.
    const logisticsInfo = [
      { slas: [pickupSla('store-1', 100)] },
      { slas: [pickupSla('store-2', 70)] },
    ]

    const storeOne = getPickupOptions(logisticsInfo).find(
      (o) => o.id === 'store-1'
    )

    expect(storeOne.price).toBe(0)
  })

  it('returns an empty list when no sla is a pickup point', () => {
    expect(getPickupOptions([{ slas: [deliverySla('normal')] }])).toEqual([])
  })
})

describe('getUniquePickupPoints', () => {
  it('concatenates two lists of pickup points', () => {
    const result = getUniquePickupPoints(
      [{ id: 'store-1' }],
      [{ id: 'store-2' }]
    )

    expect(result.map((p) => p.id)).toEqual(['store-1', 'store-2'])
  })

  it('drops duplicates by id, keeping the entry from the first list', () => {
    const original = { id: 'store-1', price: 100 }
    const duplicate = { id: 'store-1', price: 999 }

    expect(getUniquePickupPoints([original], [duplicate])).toEqual([original])
  })

  it('handles either list being empty', () => {
    expect(getUniquePickupPoints([], [{ id: 'store-1' }])).toHaveLength(1)
    expect(getUniquePickupPoints([{ id: 'store-1' }], [])).toHaveLength(1)
    expect(getUniquePickupPoints([], [])).toEqual([])
  })
})
