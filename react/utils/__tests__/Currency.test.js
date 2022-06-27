import { formatCurrency, formatNumber } from '../Currency'

describe('formatCurrency', () => {
  it('should format the currency of a value', () => {
    const storePreferencesData = {
      countryCode: 'BRA',
      currencyCode: 'BRL',
      currencyFormatInfo: {
        currencyDecimalDigits: 2,
        currencyDecimalSeparator: ',',
        currencyGroupSeparator: '.',
        currencyGroupSize: 3,
        startsWithCurrencySymbol: true,
      },
      currencyLocale: 1046,
      currencySymbol: 'R$',
    }

    const value = 100

    const formattedValue = 'R$ 1,00'

    expect(
      formatCurrency({
        value,
        storePreferencesData,
      })
    ).toBe(formattedValue)
  })

  it('should format the currency of a value without currency decimal digits', () => {
    const storePreferencesData = {
      countryCode: 'BRA',
      currencyCode: 'BRL',
      currencyFormatInfo: {
        currencyDecimalDigits: 0,
        currencyDecimalSeparator: ',',
        currencyGroupSeparator: '.',
        currencyGroupSize: 3,
        startsWithCurrencySymbol: true,
      },
      currencyLocale: 1046,
      currencySymbol: 'R$',
    }

    const value = 100

    const formattedValue = 'R$ 100'

    expect(
      formatCurrency({
        value,
        storePreferencesData,
        options: {
          withSymbol: false,
        },
      })
    ).toBe(formattedValue)
  })

  it("should format the currency of a value and doesn't start with currency symbol", () => {
    const storePreferencesData = {
      countryCode: 'BRA',
      currencyCode: 'BRL',
      currencyFormatInfo: {
        currencyDecimalDigits: 2,
        currencyDecimalSeparator: ',',
        currencyGroupSeparator: '.',
        currencyGroupSize: 3,
        startsWithCurrencySymbol: false,
      },
      currencyLocale: 1046,
      currencySymbol: 'R$',
    }

    const value = 100

    const formattedValue = '1,00 R$'

    expect(
      formatCurrency({
        value,
        storePreferencesData,
      })
    ).toBe(formattedValue)
  })

  it('should return null if has no value', () => {
    const storePreferencesData = {
      countryCode: 'BRA',
      currencyCode: 'BRL',
      currencyFormatInfo: {
        currencyDecimalDigits: 2,
        currencyDecimalSeparator: ',',
        currencyGroupSeparator: '.',
        currencyGroupSize: 3,
        startsWithCurrencySymbol: false,
      },
      currencyLocale: 1046,
      currencySymbol: 'R$',
    }

    const value = null

    const formattedValue = null

    expect(
      formatNumber({
        value,
        storePreferencesData,
      })
    ).toBe(formattedValue)
  })

  it('should return converted number with multiple decimals', () => {
    const storePreferencesData = {
      countryCode: 'BRA',
      currencyCode: 'BRL',
      currencyFormatInfo: {
        currencyDecimalDigits: 2,
        currencyDecimalSeparator: ',',
        currencyGroupSeparator: '.',
        currencyGroupSize: 3,
        startsWithCurrencySymbol: false,
      },
      currencyLocale: 1046,
      currencySymbol: 'R$',
    }

    const value = 1.92341234

    const formattedValue = '1,9'

    expect(
      formatNumber({
        value,
        storePreferencesData,
      })
    ).toBe(formattedValue)
  })
})
