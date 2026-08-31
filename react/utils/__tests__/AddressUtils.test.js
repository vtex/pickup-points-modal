import {
  hasPostalCodeOnlyNumber,
  removeNonWords,
  getShipsTo,
  unifyAddress,
} from '../AddressUtils'

const intlStub = { formatMessage: ({ id }) => id }

describe('removeNonWords', () => {
  it('removes a single non-word character', () => {
    expect(removeNonWords('12-345')).toBe('12345')
  })

  it('only removes the FIRST non-word character', () => {
    // Documents the CURRENT behaviour: the regex /\W/ has no `g` flag, so
    // String.replace strips one occurrence. A postal code with several
    // separators keeps all but the first. Looks like a latent bug — if the
    // regex gains the `g` flag, this test should fail deliberately.
    expect(removeNonWords('12-345-678')).toBe('12345-678')
  })

  it('leaves a string with no non-word characters untouched', () => {
    expect(removeNonWords('12345')).toBe('12345')
  })

  it('treats underscore as a word character and keeps it', () => {
    expect(removeNonWords('12_345')).toBe('12_345')
  })

  it('returns an empty string unchanged', () => {
    expect(removeNonWords('')).toBe('')
  })
})

describe('hasPostalCodeOnlyNumber', () => {
  it('returns true for a mask made only of digits', () => {
    expect(hasPostalCodeOnlyNumber('99999')).toBe(true)
  })

  it('returns true for a digit mask carrying one separator', () => {
    // the single separator is stripped by removeNonWords before the test
    expect(hasPostalCodeOnlyNumber('99999-999')).toBe(true)
  })

  it('returns false for a mask containing letters', () => {
    expect(hasPostalCodeOnlyNumber('AA999')).toBe(false)
  })

  it('returns false for a mask whose second separator survives the strip', () => {
    // consequence of removeNonWords only removing the first non-word character
    expect(hasPostalCodeOnlyNumber('99-999-999')).toBe(false)
  })

  it('returns the falsy mask itself rather than false when it is empty', () => {
    // Current behaviour: the `postalCodeMask &&` guard short-circuits and the
    // mask is returned as-is, so callers get '' / undefined, not a boolean.
    expect(hasPostalCodeOnlyNumber('')).toBe('')
    expect(hasPostalCodeOnlyNumber(undefined)).toBeUndefined()
    expect(hasPostalCodeOnlyNumber(null)).toBeNull()
  })
})

describe('getShipsTo', () => {
  it('maps each country code to a label and value pair', () => {
    const logisticsInfo = [{ shipsTo: ['BRA'] }]

    expect(getShipsTo(intlStub, logisticsInfo)).toEqual([
      { label: 'country.BRA', value: 'BRA' },
    ])
  })

  it('flattens the countries of every logisticsInfo item', () => {
    const logisticsInfo = [{ shipsTo: ['BRA'] }, { shipsTo: ['ARG', 'CHL'] }]

    expect(getShipsTo(intlStub, logisticsInfo).map((c) => c.value)).toEqual([
      'BRA',
      'ARG',
      'CHL',
    ])
  })

  it('de-duplicates a country offered by several items', () => {
    const logisticsInfo = [{ shipsTo: ['BRA', 'ARG'] }, { shipsTo: ['BRA'] }]

    expect(getShipsTo(intlStub, logisticsInfo).map((c) => c.value)).toEqual([
      'BRA',
      'ARG',
    ])
  })

  it('returns an empty list when there is no logisticsInfo', () => {
    expect(getShipsTo(intlStub, null)).toEqual([])
    expect(getShipsTo(intlStub, undefined)).toEqual([])
  })

  it('returns an empty list for an empty logisticsInfo', () => {
    expect(getShipsTo(intlStub, [])).toEqual([])
  })
})

describe('unifyAddress', () => {
  it('merges the fields of both addresses key by key', () => {
    const address = { city: { value: 'São Paulo' } }
    const newAddress = { city: { valid: true } }

    expect(unifyAddress(address, newAddress)).toEqual({
      city: { value: 'São Paulo', valid: true },
    })
  })

  it('lets the new address win on overlapping properties', () => {
    const address = { city: { value: 'São Paulo' } }
    const newAddress = { city: { value: 'Rio de Janeiro' } }

    expect(unifyAddress(address, newAddress).city.value).toBe('Rio de Janeiro')
  })

  it('keeps the original fields when there is no new address', () => {
    const address = { city: { value: 'São Paulo' } }

    expect(unifyAddress(address, null)).toEqual(address)
  })

  it('takes its keys from the new address when there is no original', () => {
    const newAddress = { street: { value: 'Av. Paulista' } }

    expect(unifyAddress(null, newAddress)).toEqual(newAddress)
  })

  it('only merges keys present in the first non-null address', () => {
    // Current behaviour: the key list comes from `address || newAddress`, so a
    // field that exists only in newAddress is dropped when address is given.
    const address = { city: { value: 'São Paulo' } }
    const newAddress = {
      city: { valid: true },
      street: { value: 'Av. Paulista' },
    }

    expect(Object.keys(unifyAddress(address, newAddress))).toEqual(['city'])
  })

  it('returns an empty object when both addresses are empty', () => {
    expect(unifyAddress({}, {})).toEqual({})
  })
})
