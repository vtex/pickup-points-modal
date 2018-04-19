import { PICKUP_IN_STORE } from '../constants'

export function getUnavailableItemsAmount(
  items,
  logisticsInfo,
  pickupPointId,
  sellerId
) {
  return items.filter(
    (item, index) =>
      (sellerId ? item.seller === sellerId : true) &&
      logisticsInfo[index].slas.find(sla => sla.id === pickupPointId) ===
        undefined
  ).length
}

export function getUnavailableItemsByPickup(
  items,
  logisticsInfo,
  pickupPoint,
  sellerId
) {
  return items.filter(
    (item, index) =>
      (sellerId ? item.seller === sellerId : true) &&
      logisticsInfo[index].slas.find(sla => sla.id === pickupPoint.id) ===
        undefined
  )
}

export function getItemsByPickup(items, logisticsInfo, pickupPoint, sellerId) {
  return items.filter(
    (item, index) =>
      (sellerId ? item.seller === sellerId : true) &&
      logisticsInfo[index].slas.find(sla => sla.id === pickupPoint.id)
  )
}

export function getPickupOptionGeolocations(pickupOptions) {
  if (Array.isArray(pickupOptions)) {
    return pickupOptions.map(
      pickup => pickup.pickupStoreInfo.address.geoCoordinates
    )
  }
  return pickupOptions && pickupOptions.pickupStoreInfo.address.geoCoordinates
}
