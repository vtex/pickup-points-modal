import { KM_TO_MILE, MILE_COUNTRY_LOCALES } from '../constants'

export function formatDistance(value, locale) {
  if (shouldConvertToMiles(locale)) {
    return value / KM_TO_MILE
  }
  return value
}

function shouldConvertToMiles(locale) {
  return MILE_COUNTRY_LOCALES.some(country => locale === country)
}
