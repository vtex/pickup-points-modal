import isString from 'lodash/isString'
import get from 'lodash/get'
import { PICKUP_IN_STORE } from '../constants'

function getDeliveryChannel(deliveryChannelSource) {
  if (isString(deliveryChannelSource)) {
    return deliveryChannelSource
  }
  return (
    get(deliveryChannelSource, 'deliveryChannel') ||
    get(deliveryChannelSource, 'selectedDeliveryChannel') ||
    get(deliveryChannelSource, 'id')
  )
}

export function isPickup(deliveryChannelSource) {
  const deliveryChannel = getDeliveryChannel(deliveryChannelSource)
  return deliveryChannel === PICKUP_IN_STORE
}

export function findSla(li, pickupPoint) {
  return li.slas.find(
    simulationPickupPoint =>
      (simulationPickupPoint.id &&
        simulationPickupPoint.id.includes(
          pickupPoint && (pickupPoint.id || pickupPoint.pickupPointId)
        )) ||
      (simulationPickupPoint.pickupPointId &&
        simulationPickupPoint.pickupPointId.includes(
          pickupPoint && (pickupPoint.id || pickupPoint.pickupPointId)
        ))
  )
}
