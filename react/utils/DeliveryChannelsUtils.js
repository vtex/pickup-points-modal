import isString from 'lodash/isString'
import get from 'lodash/get'
import { PICKUP_IN_STORE, DELIVERY } from '../constants'

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

export function isCurrentChannel(deliveryChannelSource, currentChannel) {
  const deliveryChannel = getDeliveryChannel(deliveryChannelSource)
  return deliveryChannel === currentChannel
}

export function isPickup(deliveryChannelSource) {
  const deliveryChannel = getDeliveryChannel(deliveryChannelSource)
  return deliveryChannel === PICKUP_IN_STORE
}

export function isDelivery(deliveryChannelSource) {
  const deliveryChannel = getDeliveryChannel(deliveryChannelSource)
  return deliveryChannel === DELIVERY
}
