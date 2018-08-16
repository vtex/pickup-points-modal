import get from 'lodash/get'
import isString from 'lodash/isString'

function checkIfIsSameSeller(sellerId, item) {
  return sellerId ? item.seller === sellerId : true
}

function getLogisticsInfoItem(logisticsInfo, index) {
  return logisticsInfo.find(li => li.itemIndex === index)
}

function hasPickupPoint(logisticsInfo, pickupPointId) {
  return logisticsInfo &&
    logisticsInfo.slas.some(sla => sla.id === pickupPointId)
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

    return isSameSeller &&
      (!logisticsInfoItem || (logisticsInfoItem && !hasPickup))
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

export function formatBusinessHoursList(pickupPointInfo) {
  const bh = pickupPointInfo && pickupPointInfo.businessHours
  const daysOrder = [1, 2, 3, 4, 5, 6, 0]

  let sameWeekDaysHours
  let newBh

  if (bh && bh.length > 0) {
    newBh = []
    daysOrder.forEach((number, i) => {
      let closed = true
      const dayInfo = {
        number: number,
      }

      bh.forEach((day, j) => {
        if (number === day.DayOfWeek) {
          closed = false
          dayInfo.openingTime = bh[j].OpeningTime
          dayInfo.closingTime = bh[j].ClosingTime
        }
      })

      dayInfo.closed = closed

      newBh.push(dayInfo)
    })

    sameWeekDaysHours = true
    newBh.forEach((day, i) => {
      if (i > 0 && i < 5 && (day.openingTime !== newBh[i - 1].openingTime || day.closingTime !== newBh[i - 1].closingTime)) {
        sameWeekDaysHours = false
      }
    })

    if (sameWeekDaysHours) {
      const condensedBusinessHours = []
      condensedBusinessHours.push({
        number: '1to5',
        closed: newBh[0].closed,
        openingTime: newBh[0].openingTime,
        closingTime: newBh[0].closingTime,
      })
      for (let i = 5; i <= 6; i++) {
        condensedBusinessHours.push({
          number: newBh[i].number,
          closed: newBh[i].closed,
          openingTime: newBh[i].openingTime,
          closingTime: newBh[i].closingTime,
        })
      }
      newBh = condensedBusinessHours
    }
  }

  return newBh
}
