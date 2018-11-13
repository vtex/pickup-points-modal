import { newAddress } from '../newAddress'
import MockDate from 'mockdate'
describe('newAddress', () => {
  it('should return country past as parameter', () => {
    MockDate.set(Date.UTC(2017, 6, 14, 18, 0, 0, 0), 180)
    const country = 'ARG'

    const expectedResultAddress = {
      addressId: (new Date().getTime() * -1).toString(),
      addressType: 'residential',
      city: null,
      complement: null,
      country: 'ARG',
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

    expect(
      JSON.stringify(
        newAddress({
          country,
        })
      )
    ).toEqual(JSON.stringify(expectedResultAddress))
  })
})
