import { PICKUP_IN_STORE } from '../constants'

export function getUnavailableItemsAmount(
  items,
  logisticsInfo,
  pickupPointId,
  sellerId
) {
  return items.filter(
    (item, index) =>
      item.seller === sellerId &&
      !!logisticsInfo[index].deliveryChannels.find(
        channel => channel.id === PICKUP_IN_STORE
      ) &&
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
      logisticsInfo[index].deliveryChannels.find(
        channel => channel.id === PICKUP_IN_STORE
      ) &&
      logisticsInfo[index].slas.find(sla => sla.id === pickupPoint.id) ===
        undefined
  )
}

export function getItemsByPickup(items, logisticsInfo, pickupPoint, sellerId) {
  return items.filter(
    (item, index) =>
      (sellerId ? item.seller === sellerId : true) &&
      logisticsInfo[index].deliveryChannels.find(
        channel => channel.id === PICKUP_IN_STORE
      ) &&
      logisticsInfo[index].slas.find(sla => sla.id === pickupPoint.id)
  )
}
