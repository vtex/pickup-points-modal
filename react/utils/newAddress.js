import getGGUID from './Gguid'

export function newAddress(address) {
  const {
    addressType,
    city,
    complement,
    country,
    geoCoordinates,
    neighborhood,
    number,
    postalCode,
    receiverName,
    reference,
    state,
    street,
    addressQuery,
    addressId,
  } = address

  return {
    addressId: addressId || getGGUID(),
    addressType: addressType || 'residential',
    city: city || null,
    complement: complement || null,
    country: country || null,
    geoCoordinates: geoCoordinates || [],
    neighborhood: neighborhood || null,
    number: number || null,
    postalCode: postalCode || null,
    receiverName: receiverName || null,
    reference: reference || null,
    state: state || null,
    street: street || null,
    addressQuery: addressQuery || '',
  }
}
