import { geolocationAutoCompleteAddress } from 'vtex.address-form/geolocationAutoCompleteAddress'

export function getCurrentPosition(successCallback, errorCallback) {
  return navigator.geolocation.getCurrentPosition(
    position => successCallback(position),
    errorCallback,
    {
      maximumAge: Infinity,
      // getCurrentPosition timeout varies a lot depending on device,
      // browser, and even user location. Avoid reducing this value,
      // but if you do, track timeouts on a logging service.
      // (currently, look for "dismissedGeolocation" on our kibana logs)
      timeout: 10000,
      enableHighAccuracy: true,
    }
  )
}

export function handleGetAddressByGeolocation({
  newPosition,
  googleMaps,
  onChangeAddress,
  rules,
  address,
}) {
  const geocoder = new googleMaps.Geocoder()

  geocoder.geocode({ location: newPosition }, (results, status) => {
    if (status === googleMaps.GeocoderStatus.OK) {
      if (results[0]) {
        const googleAddress = results[0]
        const autoCompletedAddress = geolocationAutoCompleteAddress(
          address,
          googleAddress,
          rules
        )
        onChangeAddress({
          ...autoCompletedAddress,
          complement: {
            value: null,
          },
          reference: {
            value: null,
          },
        })
      }
    } else {
      console.warn(`Google Maps Error: ${status}`)
    }
  })
}
