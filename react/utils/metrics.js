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

function log(data) {
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'development' && window.checkoutLogger) {
    window.checkoutLogger(data)
  } else {
    console.log('Log', data)
  }
}
