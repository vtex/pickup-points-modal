import { newAddress } from '../utils/newAddress'
import { PICKUP_IN_STORE, SEARCH } from '../constants'

export function fetchExternalPickupPoints(geoCoordinates) {
  return fetch(
    `/api/checkout/pub/pickup-points?geoCoordinates=${geoCoordinates[0]};${
      geoCoordinates[1]
    }&page=1&pageSize=100`
  ).then(response => response.json())
}

export function getAvailablePickups({
  logisticsInfo,
  salesChannel,
  orderFormId,
  pickupAddress,
}) {
  const pickupAddressWithAddressId = newAddress({
    ...pickupAddress,
    addressId: undefined,
    addressType: SEARCH,
  })

  const dataRequest = {
    orderFormId,
    shippingData: {
      selectedAddresses: [pickupAddressWithAddressId],
      logisticsInfo: logisticsInfo.map(li => ({
        addressId: pickupAddressWithAddressId.addressId,
        itemIndex: li.itemIndex,
        selectedDeliveryChannel: PICKUP_IN_STORE,
        selectedSla: null,
      })),
    },
  }

  return fetch(
    `/api/checkout/pub/orderForms/simulation?sc=${salesChannel}&rnbBehavior=0`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataRequest),
    }
  ).then(response => response.json())
}

export function updateShippingData(logisticsInfo, pickupPoint) {
  const pickupAddress = pickupPoint.pickupStoreInfo
    ? pickupPoint.pickupStoreInfo.address
    : pickupPoint.address

  const pickupAddressWithAddressId = newAddress({
    ...pickupAddress,
    addressId: undefined,
    addressType: SEARCH,
  })
  const shippingData = {
    selectedAddresses: [pickupAddressWithAddressId],
    logisticsInfo: logisticsInfo.map(li => {
      const hasSla = li.slas.some(sla => sla.id === pickupPoint.id)
      return {
        addressId: hasSla ? pickupAddressWithAddressId.addressId : li.addressId,
        selectedSla: hasSla ? pickupPoint.id : li.selectedSla,
        selectedDeliveryChannel: hasSla
          ? PICKUP_IN_STORE
          : li.selectedDeliveryChannel,
      }
    }),
  }
  return (
    window.vtexjs &&
    window.vtexjs.checkout.sendAttachment('shippingData', shippingData)
  )
}
