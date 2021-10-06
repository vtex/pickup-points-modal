import { geolocationAutoCompleteAddress } from 'vtex.address-form/geolocationAutoCompleteAddress'

export function getCurrentPosition(successCallback, errorCallback) {
  return navigator.geolocation.getCurrentPosition(
    position => successCallback(position),
    error => {
      // TODO#1: retry in case of timeout, possibly with a lower accuracy.
      // Not implementing right now because we might need to look into issues that long
      // timeouts might cause, especially in terms of UX. But below is a suggestion:
      /* 
      const TIMEOUT = 3
      if (error.code === TIMEOUT ) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
          maximumAge: Infinity,
          timeout: 20000,
          enableHighAccuracy: false,
        })
      } else {
        errorCallback(error)
      }
      */
      errorCallback(error)
    },
    {
      maximumAge: Infinity,
      // Increased timeout from 2000 to 6000.
      // 2000 was timing out on my (@lbebber) machine, but increasing to ~5000 did the trick.
      // Setting to 6000 for a balance between leaving a margin vs not waiting too much, but
      // the ideal timeout value has to be looked into.
      // Refer to TODO#3
      timeout: 6000,
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
