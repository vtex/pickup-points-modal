import { formatDistance } from '../Distance'
import { KM_TO_MILE, MILE_COUNTRY_LOCALES } from '../../constants'

const [firstMileLocale] = MILE_COUNTRY_LOCALES

describe('formatDistance', () => {
  it('converts kilometres to miles for every mile country locale', () => {
    MILE_COUNTRY_LOCALES.forEach((locale) => {
      expect(formatDistance(10, locale)).toBe(10 / KM_TO_MILE)
    })
  })

  it('keeps the value in kilometres for a metric locale such as pt-BR', () => {
    expect(formatDistance(10, 'pt-BR')).toBe(10)
  })

  it('returns zero unchanged for a mile locale', () => {
    expect(formatDistance(0, firstMileLocale)).toBe(0)
  })

  it('returns zero unchanged for a metric locale', () => {
    expect(formatDistance(0, 'pt-BR')).toBe(0)
  })

  it('leaves the value untouched for an unknown locale', () => {
    expect(formatDistance(5.5, 'xx-XX')).toBe(5.5)
  })

  it('leaves the value untouched when no locale is given', () => {
    expect(formatDistance(5.5, undefined)).toBe(5.5)
    expect(formatDistance(5.5, null)).toBe(5.5)
  })

  it('matches the locale exactly and does not convert a region variant like en-CA', () => {
    expect(formatDistance(10, 'en-CA')).toBe(10)
  })
})
