import get from 'lodash/get'
import isString from 'lodash/isString'
import uniqBy from 'lodash/uniqBy'
import flatten from 'lodash/flatten'

import { isPickup } from './SlasUtils'

function checkIfIsSameSeller(sellerId, item) {
  return sellerId ? item.seller === sellerId : true
}

function getLogisticsInfoItem(logisticsInfo, index) {
  return logisticsInfo.find((li) => li.itemIndex === index)
}

function hasPickupPoint(logisticsInfo, pickupPointId) {
  return (
    logisticsInfo && logisticsInfo.slas.some((sla) => sla.id === pickupPointId)
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
  if (!pickupPoint) return []

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
  if (!pickupPoint) return []

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
      (pickup) =>
        pickup && get(pickup, 'pickupStoreInfo.address.geoCoordinates')
    )
  }

  return (
    pickupOptions &&
    get(pickupOptions, 'pickupStoreInfo.address.geoCoordinates')
  )
}

export function getPickupPointGeolocations(pickupPoint) {
  if (Array.isArray(pickupPoint)) {
    return pickupPoint.map(
      (pickup) => pickup && get(pickup, 'address.geoCoordinates')
    )
  }

  return pickupPoint && get(pickupPoint, 'address.geoCoordinates')
}

export function getPickupOptions(logisticsInfo) {
  if (!logisticsInfo) return []

  const pickupPoints = uniqBy(
    flatten(logisticsInfo.map((li) => li.slas.filter((sla) => isPickup(sla)))),
    'id'
  )

  return pickupPoints.map((pickupPoint) => {
    const price = logisticsInfo.reduce((accPrice, currLi) => {
      const currentPickupPoint = currLi.slas.find(
        (sla) => sla.id === pickupPoint.id
      )

      return currentPickupPoint ? accPrice + currentPickupPoint.price : 0
    }, 0)

    return {
      ...pickupPoint,
      price,
    }
  })
}

export function getUniquePickupPoints(pickupArray, newPickupArray) {
  return uniqBy([...pickupArray, ...newPickupArray], 'id')
}
