import get from 'lodash/get'
import isString from 'lodash/isString'

export function getUnavailableItemsAmount(
  items,
  logisticsInfo,
  pickupPoint,
  sellerId
) {
  const unavailableItems = getUnavailableItemsByPickup(
    items,
    logisticsInfo,
    pickupPoint,
    sellerId
  )
  return unavailableItems && unavailableItems.length
}

export function getUnavailableItemsByPickup(
  items,
  logisticsInfo,
  pickupPoint,
  sellerId
) {
  const pickupPointId = isString(pickupPoint) ? pickupPoint : pickupPoint.id

  return items.filter((item, index) => {
    const isSameSeller = sellerId ? item.seller === sellerId : true
    const hasLogisticsInfo = !!logisticsInfo[index]
    const hasPickup = logisticsInfo[index].slas.some(
      sla => sla.id === pickupPointId
    )

    return (
      isSameSeller && (!hasLogisticsInfo || (hasLogisticsInfo && !hasPickup))
    )
  })
}

export function getItemsByPickup(items, logisticsInfo, pickupPoint, sellerId) {
  const pickupPointId = isString(pickupPoint) ? pickupPoint : pickupPoint.id

  return items.filter((item, index) => {
    const isSameSeller = sellerId ? item.seller === sellerId : true
    const hasLogisticsInfo = !!logisticsInfo[index]
    const hasPickup = logisticsInfo[index].slas.some(
      sla => sla.id === pickupPointId
    )

    return isSameSeller && hasLogisticsInfo && hasPickup
  })
}

export function getPickupOptionGeolocations(pickupOptions) {
  if (Array.isArray(pickupOptions)) {
    return pickupOptions.map(
      pickup => pickup && get(pickup, 'pickupStoreInfo.address.geoCoordinates')
    )
  }
  return (
    pickupOptions &&
    get(pickupOptions, 'pickupStoreInfo.address.geoCoordinates')
  )
}
