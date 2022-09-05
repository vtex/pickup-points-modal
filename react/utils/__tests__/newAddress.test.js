import MockDate from 'mockdate'

import { newAddress } from '../newAddress'

describe('newAddress', () => {
  it('should return country past as parameter', () => {
    MockDate.set(Date.UTC(2017, 6, 14, 18, 0, 0, 0), 180)
    const country = 'ARG'

    const expectedResultAddress = {
      addressId: (new Date().getTime() * -1).toString(),
      addressType: 'search',
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
      isDisposable: false,
    }

    const resultAddress = newAddress({
      country,
    })

    expect(resultAddress).toEqual(expectedResultAddress)
  })
})
