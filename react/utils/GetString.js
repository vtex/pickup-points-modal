export function getPickupSlaString(slas) {
  return slas.reduce(
    (accumulatedString, currentPickupPoint) =>
      currentPickupPoint.id ? accumulatedString + currentPickupPoint.id + currentPickupPoint.pickupDistance : '',
    ''
  )
}

export function getPickupGeolocationString(geolocations) {
  return geolocations.reduce(
    (accumulatedString, currentGeolocation) =>
      currentGeolocation.length > 0
        ? accumulatedString + currentGeolocation[0]
        : '',
    ''
  )
}
