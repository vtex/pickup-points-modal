import uniq from 'lodash/uniq'
import flatten from 'lodash/flatten'

export function hasPostalCodeOnlyNumber(postalCodeMask) {
  return postalCodeMask && /^\d+$/.test(removeNonWords(postalCodeMask))
}

export function removeNonWords(string) {
  return string.replace(/\W/, '')
}

export function getShipsTo(intl, logisticsInfo) {
  const countries = uniq(
    flatten(logisticsInfo ? logisticsInfo.map(item => item.shipsTo) : [])
  )

  return addCountryLabel(intl, countries)
}

function addCountryLabel(intl, countries) {
  return countries.map(countryCode => ({
    label: intl.formatMessage({ id: `country.${countryCode}` }),
    value: countryCode,
  }))
}
