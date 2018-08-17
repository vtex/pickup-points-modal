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

export function formatBusinessHoursList(businessHours) {
  const normalizedBusinessHours = normalizeBusinessHours(businessHours)

  const weekDaysHaveTheSameHours = doesWeekDaysHaveTheSameHours(
    normalizedBusinessHours
  )

  if (weekDaysHaveTheSameHours) {
    return condenseWeekDaysHours(normalizedBusinessHours)
  }

  return normalizedBusinessHours
}

const DAYS_ORDER = [1, 2, 3, 4, 5, 6, 0]

function normalizeBusinessHours(businessHours) {
  return DAYS_ORDER.map(number => {
    const day = businessHours.find(day => number === day.DayOfWeek)

    return {
      number,
      closed: true,
      ...(day
        ? {
            closed: false,
            openingTime: day.OpeningTime,
            closingTime: day.ClosingTime,
          }
        : {}),
    }
  })
}

const MONDAY = 0
const FRIDAY = 4
function doesWeekDaysHaveTheSameHours(businessHours) {
  const weekDays = businessHours.slice(MONDAY, FRIDAY)

  let previousOpeningTime = weekDays[0].openingTime
  let previousClosingTime = weekDays[0].closingTime

  for (let i = 1; i < weekDays.length; i++) {
    const currentDay = weekDays[i]

    if (
      currentDay.openingTime !== previousOpeningTime ||
      currentDay.closingTime !== previousClosingTime
    ) {
      return false
    }

    previousOpeningTime = currentDay.openingTime
    previousClosingTime = currentDay.closingTime
  }

  return true
}

function condenseWeekDaysHours(businessHours) {
  return businessHours.reduce((acc, businessHour, index) => {
    if (index >= MONDAY && index <= FRIDAY) {
      if (index === MONDAY) {
        return acc.concat({
          number: '1to5',
          closed: businessHour.closed,
          openingTime: businessHour.openingTime,
          closingTime: businessHour.closingTime,
        })
      }
      return acc
    }

    return acc.concat(businessHour)
  }, [])
}
