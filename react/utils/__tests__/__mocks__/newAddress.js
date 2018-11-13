export default function newAddress(country) {
  return {
    addressId: '1',
    addressType: 'residential',
    city: null,
    complement: null,
    country: country,
    geoCoordinates: [],
    neighborhood: null,
    number: null,
    postalCode: null,
    receiverName: null,
    reference: null,
    state: null,
    street: null,
    addressQuery: '',
  }
}
