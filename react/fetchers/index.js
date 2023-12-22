import axios from 'axios'
import axiosRetry from 'axios-retry'

import { newAddress } from '../utils/newAddress'
import { DELIVERY, PICKUP_IN_STORE, SEARCH } from '../constants'
import {
  getFirstItemWithSelectedDelivery,
  isPickup,
} from '../utils/DeliveryChannelsUtils'

axiosRetry(axios, { retries: 2 })

function getRootPath() {
  return (
    window.__RUNTIME__.rootPath ||
    (window.vtex &&
      window.vtex.renderRuntime &&
      window.vtex.renderRuntime.rootPath) ||
    ''
  )
}

export function fetchExternalPickupPoints(geoCoordinates) {
  const rootPath = getRootPath()

  return fetch(
    `${rootPath || ''}/api/checkout/pub/pickup-points?geoCoordinates=${
      geoCoordinates[0]
    };${geoCoordinates[1]}&page=1&pageSize=100`
  ).then((response) => response.json())
}

export function getAvailablePickups({
  logisticsInfo,
  salesChannel,
  orderFormId,
  pickupAddress,
}) {
  const rootPath = getRootPath()

  const pickupAddressWithAddressId = newAddress({
    ...pickupAddress,
    addressId: undefined,
    addressType: SEARCH,
  })

  const dataRequest = {
    orderFormId,
    shippingData: {
      selectedAddresses: [pickupAddressWithAddressId],
      logisticsInfo: logisticsInfo.map((li) => ({
        addressId: pickupAddressWithAddressId.addressId,
        itemIndex: li.itemIndex,
        selectedDeliveryChannel: PICKUP_IN_STORE,
        selectedSla: null,
      })),
    },
  }

  return axios({
    url: `${
      rootPath || ''
    }/api/checkout/pub/orderForms/simulation?sc=${salesChannel}&rnbBehavior=0`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(dataRequest),
  })
}

export function updateShippingData(
  residentialAddress,
  logisticsInfo,
  pickupPoint
) {
  const pickupAddress = pickupPoint.pickupStoreInfo
    ? pickupPoint.pickupStoreInfo.address
    : pickupPoint.address

  const hasGeocoordinates =
    pickupAddress && pickupAddress.geoCoordinates.length > 0

  const pickupAddressWithAddressId = newAddress({
    ...pickupAddress,
    addressId: undefined,
    addressType: SEARCH,
  })

  const logisticsInfoWithPickupSelected = logisticsInfo.map((li) => {
    const hasPickupSla = li.slas.some((sla) => sla.id === pickupPoint.id)
    const shouldKeepSelectedSla = !isPickup(li)

    return {
      itemIndex: li.itemIndex,
      slas: li.slas,
      addressId: hasPickupSla
        ? pickupAddressWithAddressId.addressId
        : li.addressId,
      selectedSla: hasPickupSla
        ? pickupPoint.id
        : shouldKeepSelectedSla
        ? li.selectedSla
        : null,
      selectedDeliveryChannel: hasPickupSla
        ? PICKUP_IN_STORE
        : shouldKeepSelectedSla
        ? li.selectedDeliveryChannel
        : null,
    }
  })

  const firstItemWithSelectedDelivery = getFirstItemWithSelectedDelivery(
    logisticsInfoWithPickupSelected
  )

  const defaultDeliverySla =
    firstItemWithSelectedDelivery && firstItemWithSelectedDelivery.selectedSla

  const logisticsInfoWithDefaultDeliverySla =
    logisticsInfoWithPickupSelected.map((li) => {
      const hasDefaultDeliverySla = li.slas.find(
        (sla) => sla.id === defaultDeliverySla
      )

      if (!li.selectedDeliveryChannel && hasDefaultDeliverySla) {
        return {
          ...li,
          selectedSla: defaultDeliverySla,
          selectedDeliveryChannel: DELIVERY,
        }
      }

      return li
    })

  const shippingData = {
    ...(hasGeocoordinates ? { clearAddressIfPostalCodeNotFound: false } : {}),
    selectedAddresses: [
      ...(residentialAddress ? [residentialAddress] : []),
      pickupAddressWithAddressId,
    ],
    logisticsInfo: logisticsInfoWithDefaultDeliverySla,
  }

  return (
    window.vtexjs &&
    window.vtexjs.checkout.sendAttachment('shippingData', shippingData)
  )
}
