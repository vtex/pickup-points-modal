import get from 'lodash/get'
import isString from 'lodash/isString'

function checkIfIsSameSeller(sellerId, item) {
  return sellerId ? item.seller === sellerId : true
}

function getLogisticsInfoItem(logisticsInfo, index) {
  return logisticsInfo.find(li => li.itemIndex === index)
}

function hasPickupPoint(logisticsInfo, pickupPointId) {
  return (
    logisticsInfo && logisticsInfo.slas.some(sla => sla.id === pickupPointId)
  )
}

function getPickupPointId(pickupPoint) {
  return isString(pickupPoint) ? pickupPoint : pickupPoint.id
}

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
  const pickupPointId = getPickupPointId(pickupPoint)

  return items.filter((item, index) => {
    const isSameSeller = checkIfIsSameSeller(sellerId, item)
    const logisticsInfoItem = getLogisticsInfoItem(logisticsInfo, index)
    const hasPickup = hasPickupPoint(logisticsInfoItem, pickupPointId)

    return (
      isSameSeller && (!logisticsInfoItem || (logisticsInfoItem && !hasPickup))
    )
  })
}

export function getItemsWithPickupPoint(
  items,
  logisticsInfo,
  pickupPoint,
  sellerId
) {
  const pickupPointId = getPickupPointId(pickupPoint)

  return items.filter((item, index) => {
    const isSameSeller = checkIfIsSameSeller(sellerId, item)
    const logisticsInfoItem = getLogisticsInfoItem(logisticsInfo, index)
    const hasPickup = hasPickupPoint(logisticsInfoItem, pickupPointId)

    return isSameSeller && logisticsInfoItem && hasPickup
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
