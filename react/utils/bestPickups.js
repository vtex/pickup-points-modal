import estimateCalculator from '@vtex/estimate-calculator'
import { getUnavailableItemsAmount } from './pickupUtils'
import sortBy from 'lodash/sortBy'

export function getBestPickupPoints(pickupOptions, items, logisticsInfo) {
  const result = getOptionsWithAvailability({
    items,
    logisticsInfo,
    pickupOptions,
  })

  return calculatePickupPointsScore({
    calcParams: result.calcParams,
    pickupOptions: result.optionsWithAvailability,
  })
}

function getOptionsWithAvailability({ items, logisticsInfo, pickupOptions }) {
  const calcParams = {
    numberOfProducts: items.length,
    multipliers: {
      pickupDistance: 1.4,
      price: 1,
      shippingEstimate: 2,
      thirdParty: 1,
      missing: 3,
      missingEach: 1.5,
    },
    priceLimit: 1,
    shippingEstimateLimit: 0,
    missingLimit: items.length / 2,
  }

  const optionsWithAvailability = pickupOptions.map(pickupOption => {
    const unavailableAmount = getUnavailableItemsAmount(
      items,
      logisticsInfo,
      pickupOption
    )

    if (pickupOption.price > calcParams.priceLimit) {
      calcParams.priceLimit = pickupOption.price
    }

    const estimateInSeconds = estimateCalculator.getShippingEstimateQuantityInSeconds(
      pickupOption.shippingEstimate
    )

    if (estimateInSeconds > calcParams.shippingEstimateLimit) {
      calcParams.shippingEstimateLimit = estimateInSeconds
    }

    if (unavailableAmount < calcParams.missingLimit) {
      calcParams.missingLimit = unavailableAmount
    }

    return {
      ...pickupOption,
      availability: calcParams.numberOfProducts - unavailableAmount,
    }
  })

  return {
    calcParams,
    optionsWithAvailability,
  }
}

function calculatePickupPointsScore({ calcParams, pickupOptions }) {
  const {
    multipliers,
    numberOfProducts,
    priceLimit,
    shippingEstimateLimit,
    missingLimit,
  } = calcParams

  const newPickupOptions = pickupOptions.map(pickup => {
    let points

    const shippingEstimate = estimateCalculator.getShippingEstimateQuantityInSeconds(
      pickup.shippingEstimate
    )

    // Distance
    points = multipliers.pickupDistance * pickup.pickupDistance

    // Price
    points += (multipliers.price / priceLimit) * pickup.price

    // Days
    points +=
      (multipliers.shippingEstimate / shippingEstimateLimit) * shippingEstimate

    // 3rd Party
    if (pickup.isThirdParty) {
      points += multipliers.thirdParty
    }

    // Missing any item
    if (pickup.availability < numberOfProducts) {
      points += multipliers.missing
      points +=
        ((numberOfProducts - pickup.availability) /
          (numberOfProducts - missingLimit)) *
        multipliers.missingEach
    }

    return {
      ...pickup,
      score: points.toFixed(2),
    }
  })

  return sortBy(newPickupOptions, 'score')
}
