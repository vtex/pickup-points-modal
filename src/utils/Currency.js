export function formatCurrency({
  value,
  storePreferencesData,
  options = { isInt: true },
}) {
  const { currencySymbol, currencyFormatInfo } = storePreferencesData

  const {
    currencyDecimalDigits,
    currencyDecimalSeparator,
    currencyGroupSeparator,
    startsWithCurrencySymbol,
  } = currencyFormatInfo

  value = options.isInt ? value / 100 : value

  value = value.toFixed(currencyDecimalDigits)

  const valueDividedInParts = value.split('.')

  const decimalPart = valueDividedInParts[1]

  let wholePart = valueDividedInParts[0]

  wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, currencyGroupSeparator)

  value =
    currencyDecimalDigits > 0
      ? wholePart + currencyDecimalSeparator + decimalPart
      : wholePart

  return startsWithCurrencySymbol
    ? `${currencySymbol} ${value}`
    : `${value} ${currencySymbol}`
}
