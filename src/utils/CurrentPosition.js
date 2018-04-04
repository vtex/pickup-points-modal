export function getCurrentPosition(successCallback, errorCallback) {
  return navigator.geolocation.getCurrentPosition(
    position => successCallback(position),
    error => errorCallback(error),
    { maximumAge: 50000, timeout: 20000, enableHighAccuracy: true }
  )
}

export function handleGetAddressByGeolocation({
  newPosition,
  geocoder,
  googleMaps,
  onChangeAddress,
  rules,
  address,
}) {
  if (!geocoder) {
    geocoder = new googleMaps.Geocoder()
  }

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
