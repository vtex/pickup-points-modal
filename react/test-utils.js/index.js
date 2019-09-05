import React from 'react'
import messages from '../../messages/pt.json'
import { IntlProvider } from 'react-intl'
import { render } from 'react-testing-library'
import { ModalStateContext } from '../modalStateContext'
import { SIDEBAR } from '../constants/index.js'

const renderWithIntl = node => {
  return render(
    <IntlProvider
      locale="pt"
      messages={{ ...messages, ...{ 'country.BRA': 'BRA' } }}>
      {node}
    </IntlProvider>
  )
}

const renderWithModalState = node => {
  return render(
    <ModalStateContext.Provider
      value={{
        activeState: SIDEBAR,
        setActiveSidebarState: jest.fn(),
        shouldUseMaps: false,
        setSelectedPickupPoint: jest.fn(),
        setShouldSearchArea: jest.fn(),
        logisticsInfo: [
          {
            itemIndex: 0,
          },
        ],
        selectedPickupPoint: {
          pickupStoreInfo: {
            address: {},
          },
        },
      }}>
      <IntlProvider
        locale="pt"
        messages={{ ...messages, ...{ 'country.BRA': 'BRA' } }}>
        {node}
      </IntlProvider>
    </ModalStateContext.Provider>
  )
}

export * from 'react-testing-library'

export { renderWithIntl, renderWithModalState }
