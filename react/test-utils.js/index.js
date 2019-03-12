import React from 'react'
import { IntlProvider } from 'react-intl'
import { render } from 'react-testing-library'
import messages from '../../messages/pt.json'

const renderWithIntl = node => {
  return render(
    <IntlProvider
      locale="pt"
      messages={{ ...messages, ...{ 'country.BRA': 'BRA' } }}>
      {node}
    </IntlProvider>
  )
}

export * from 'react-testing-library'

export { renderWithIntl }
