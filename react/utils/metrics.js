export function searchPickupAddressByGeolocationEvent(data) {
  log({
    name: 'searchPickupAddressByGeolocation',
    data: {
      searchedAddressByGeolocation: data.searchedAddressByGeolocation || false,
      confirmedGeolocationPopUp: data.confirmedGeolocation || false,
      dismissedGeolocation: data.dismissedGeolocation || false,
      deniedGeolocationPopUp: data.deniedGeolocation || false,
      positionUnavailable: data.positionUnavailable || false,
      browserError: data.browserError || false,
      closedWhileLoading: data.closedWhileLoading || false,
      elapsedTime: data.elapsedTime || 0,
    },
  })
}

export function openPickupPointsModalEvent() {
  log({ name: 'openPickupPointsModal' })
}

export function closePickupPointsModalEvent() {
  log({ name: 'closePickupPointsModal' })
}

export function pickupPointConfirmationEvent() {
  log({ name: 'pickupPointConfirmation' })
}

// // the strings below help keeping track of how
// // the user has selected the pickup point
// selected pickup point from the map
export const SELECTION_METHOD_MAP = 'map'
// selected pickup point from the list
export const SELECTION_METHOD_LIST = 'list'
// selected pickup point from the list, after clicking "view all pickup points"
export const SELECTION_METHOD_LIST_OTHERS = 'list-others'

export function pickupPointSelectionEvent({ selectionMethod }) {
  log({
    name: 'pickupPointSelection',
    data: { selectionMethod },
  })
}

function log(data) {
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'development' && window.checkoutLogger) {
    window.checkoutLogger(data)
  } else {
    // eslint-disable-next-line no-console
    console.log('Log', data)
  }
}
