import React from 'react'
import { render, screen } from '@vtex/test-tools/react'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import renderer from 'react-test-renderer'
import { addValidation } from '@vtex/address-form'
import BRA from '@vtex/address-form/lib/country/BRA'
import userEvent from '@testing-library/user-event'

import PickupPointDetails from '../PickupPointDetails'
import { PICKUP, DELIVERY, PICKUP_IN_STORE, SIDEBAR } from '../../constants'
import messages from '../../../messages/en.json'
import { ModalStateContext } from '../../modalStateContext'
import ModalState from '../../ModalState'

jest.mock('../../utils/Images', () => ({
  fixImageUrl: () => 'teste.png',
}))

describe('PickupPointDetails', () => {
  let state
  let store
  let props
  let handleChangeActiveSLAOption
  let handleClosePickupPointsModal
  let togglePickupDetails
  let selectNextPickupPoint
  let setActiveSidebarState
  let modalState

  const address = {
    addressType: 'residential',
    receiverName: null,
    addressId: '10',
    postalCode: '22222222',
    city: 'Rio de janeiro',
    state: 'RJ',
    country: 'BRA',
    street: 'Av das Américas',
    number: '',
    neighborhood: 'Barra da Tijuca',
    complement: 'Loja Barra da Tijuca',
    reference: null,
    geoCoordinates: { value: [] },
    addressQuery: 'query',
  }

  beforeEach(() => {
    handleChangeActiveSLAOption = jest.fn()
    handleClosePickupPointsModal = jest.fn()
    togglePickupDetails = jest.fn()
    setActiveSidebarState = jest.fn()
    selectNextPickupPoint = jest.fn()

    modalState = {
      activeState: SIDEBAR,
      setActiveSidebarState,
      shouldUseMaps: false,
      setShouldSearchArea: jest.fn(),
      setSelectedPickupPoint: jest.fn(),
      setHoverPickupPoint: jest.fn(),
      selectNextPickupPoint,
      pickupPoints: [
        {
          id: '1',
          pickupPointId: '1',
          friendlyName: 'Loja VTEX',
          name: 'test',
          address: {
            addressId: '19fk',
            addressType: 'residential',
            geoCoordinates: [123, 123],
          },
          businessHours: [
            { DayOfWeek: 0, OpeningTime: '02:00:00', ClosingTime: '14:00:00' },
            { DayOfWeek: 6, OpeningTime: '03:00:00', ClosingTime: '11:30:00' },
          ],
        },
        {
          id: '2',
          pickupPointId: '2',
          friendlyName: 'Outra Loja',
          name: 'test2',
          address: {
            addressId: '19fk',
            addressType: 'residential',
            geoCoordinates: [125, 125],
          },
          businessHours: [
            { ClosingTime: '12:00:00', DayOfWeek: 0, OpeningTime: '02:00:00' },
            { ClosingTime: '22:30:00', DayOfWeek: 6, OpeningTime: '16:00:00' },
          ],
        },
      ],
      pickupOptions: [
        {
          id: '1',
          pickupPointId: '1',
          friendlyName: 'Loja VTEX',
          address: {
            addressId: '19fk',
            addressType: 'residential',
            geoCoordinates: [123, 123],
          },
          pickupStoreInfo: {
            isPickupStore: true,
            friendlyName: 'Loja VTEX',
            address: {
              addressType: 'pickup',
              receiverName: null,
              addressId: '1f848d7',
              isDisposable: true,
              postalCode: '22230061',
              city: 'Rio de Janeiro',
              state: 'RJ',
              country: 'BRA',
              street: 'Rua Marquês de Abrantes',
              number: '5',
              neighborhood: 'Flamengo',
              complement: '',
              reference: null,
              geoCoordinates: [-43.17771, -22.93772],
            },
            additionalInfo: 'não entre de sunga\nnão entre sem sunga',
            dockId: '11dbf12',
          },
        },
        {
          id: '2',
          pickupPointId: '2',
          friendlyName: 'Outra Loja',
          address: {
            addressId: '19fk',
            addressType: 'residential',
            geoCoordinates: [125, 125],
          },
          pickupStoreInfo: {
            isPickupStore: true,
            friendlyName: 'Outra Loja',
            address: {
              addressType: 'pickup',
              receiverName: null,
              addressId: '1f848d7',
              isDisposable: true,
              postalCode: '22230061',
              city: 'Rio de Janeiro',
              state: 'RJ',
              country: 'BRA',
              street: 'Rua Marquês de Abrantes',
              number: '5',
              neighborhood: 'Flamengo',
              complement: '',
              reference: null,
              geoCoordinates: [-43.17771, -22.93772],
            },
            additionalInfo: 'não entre de sunga\nnão entre sem sunga',
            dockId: '11dbf12',
          },
        },
      ],
      selectedPickupPoint: {
        name: 'Loja VTEX',
        price: 100,
        shippingEstimate: '1bd',
        pickupStoreInfo: {
          friendlyName: 'Loja VTEX',
          address: {
            addressId: '19fk',
            addressType: 'residential',
            geoCoordinates: [123, 123],
          },
        },
        deliveryChannel: PICKUP_IN_STORE,
        id: '1',
        pickupPointId: '1',
      },
      logisticsInfo: [
        {
          itemIndex: 0,
          deliveryChannels: [{ id: DELIVERY }],
          selectedSla: '2',
          slas: [
            {
              name: 'test',
              price: 100,
              shippingEstimate: '1bd',
              deliveryChannel: PICKUP_IN_STORE,
              id: '1',
              pickupStoreInfo: { friendlyName: 'test', address },
            },
            {
              name: 'test',
              price: 100,
              shippingEstimate: '1bd',
              deliveryChannel: PICKUP_IN_STORE,
              id: '2',
              pickupStoreInfo: { friendlyName: 'test', address },
            },
          ],
        },
        {
          itemIndex: 1,
          deliveryChannels: [{ id: PICKUP_IN_STORE }],
          selectedSla: '2',
          slas: [
            {
              name: 'test',
              price: 100,
              shippingEstimate: '1bd',
              deliveryChannel: PICKUP_IN_STORE,
              id: '1',
              pickupStoreInfo: { friendlyName: 'test', address },
            },
            {
              name: 'test',
              price: 100,
              shippingEstimate: '1bd',
              deliveryChannel: PICKUP_IN_STORE,
              id: '2',
              pickupStoreInfo: { friendlyName: 'test', address },
            },
          ],
        },
        {
          itemIndex: 2,
          deliveryChannels: [{ id: PICKUP_IN_STORE }],
          selectedSla: '2',
          slas: [
            {
              name: 'test',
              price: 100,
              shippingEstimate: '1bd',
              deliveryChannel: PICKUP_IN_STORE,
              id: '1',
              pickupStoreInfo: { friendlyName: 'test', address },
            },
            {
              name: 'test',
              price: 100,
              shippingEstimate: '1bd',
              deliveryChannel: PICKUP_IN_STORE,
              id: '3',
              pickupStoreInfo: { friendlyName: 'test', address },
            },
          ],
        },
      ],
    }

    state = {
      pickup: {
        activeSellerId: '1',
        pickupPointId: '2',
        pickupOptions: [
          {
            name: 'test',
            price: 100,
            shippingEstimate: '1bd',
            pickupStoreInfo: {
              friendlyName: 'test',
              address: {
                addressId: '19fk',
                addressType: 'residential',
                geoCoordinates: [123, 123],
              },
            },
            deliveryChannel: PICKUP_IN_STORE,
            id: '1',
          },
          {
            name: 'test',
            price: 100,
            shippingEstimate: '1bd',
            pickupStoreInfo: {
              friendlyName: 'test',
              address: {
                addressId: '19fk',
                addressType: 'residential',
                geoCoordinates: [123, 123],
              },
            },
            deliveryChannel: PICKUP_IN_STORE,
            id: '2',
          },
        ],
      },
      orderForm: {
        googleMapsKey: '1234',
        clientPreferencesData: {
          locale: 'pt-BR',
        },
        items: [
          {
            name: 'test',
            imageUrl: 'test.png',
            uniqueId: 'xablau',
            seller: '1',
          },
          {
            name: 'test2',
            imageUrl: 'test2.png',
            uniqueId: 'xablau2',
            seller: '1',
          },
          {
            name: 'test3',
            imageUrl: 'test2.png',
            uniqueId: 'xablau3',
            seller: '2',
          },
        ],
        activeTab: PICKUP,
        storePreferencesData: {
          countryCode: 'BRA',
          currencyCode: 'BRL',
          currencySymbol: 'R$',
          currencyFormatInfo: {
            currencyDecimalDigits: 2,
            currencyDecimalSeparator: ',',
            currencyGroupSeparator: '.',
            currencyGroupSize: 3,
            startsWithCurrencySymbol: true,
          },
        },
        shippingData: {
          address: addValidation({
            addressType: 'residential',
            receiverName: null,
            addressId: '10',
            postalCode: '22222222',
            city: 'Rio de janeiro',
            state: 'RJ',
            country: 'BRA',
            street: 'Av das Américas',
            number: '',
            neighborhood: 'Barra da Tijuca',
            complement: 'Loja Barra da Tijuca',
            reference: null,
            geoCoordinates: [],
            addressQuery: 'query',
          }),
          logisticsInfo: [
            {
              itemIndex: 0,
              deliveryChannels: [{ id: DELIVERY }],
              selectedSla: '2',
              slas: [
                {
                  name: 'test',
                  price: 100,
                  shippingEstimate: '1bd',
                  deliveryChannel: PICKUP_IN_STORE,
                  id: '1',
                  pickupStoreInfo: {
                    friendlyName: 'test',
                    address,
                  },
                },
                {
                  name: 'test',
                  price: 100,
                  shippingEstimate: '1bd',
                  deliveryChannel: PICKUP_IN_STORE,
                  id: '2',
                  pickupStoreInfo: {
                    friendlyName: 'test',
                    address,
                  },
                },
              ],
            },
            {
              itemIndex: 1,
              deliveryChannels: [{ id: PICKUP_IN_STORE }],
              selectedSla: '2',
              slas: [
                {
                  name: 'test',
                  price: 100,
                  shippingEstimate: '1bd',
                  deliveryChannel: PICKUP_IN_STORE,
                  id: '1',
                  pickupStoreInfo: {
                    friendlyName: 'test',
                    address,
                  },
                },
                {
                  name: 'test2',
                  price: 100,
                  shippingEstimate: '1bd',
                  deliveryChannel: PICKUP_IN_STORE,
                  id: '2',
                  pickupStoreInfo: {
                    friendlyName: 'test2',
                    address,
                  },
                },
              ],
            },
            {
              itemIndex: 2,
              deliveryChannels: [{ id: PICKUP_IN_STORE }],
              selectedSla: '2',
              slas: [
                {
                  name: 'test',
                  price: 100,
                  shippingEstimate: '1bd',
                  deliveryChannel: PICKUP_IN_STORE,
                  id: '1',
                  pickupStoreInfo: {
                    friendlyName: 'test',
                    address,
                  },
                },
                {
                  name: 'test3',
                  price: 100,
                  shippingEstimate: '1bd',
                  deliveryChannel: PICKUP_IN_STORE,
                  id: '3',
                  pickupStoreInfo: {
                    friendlyName: 'test3',
                    address,
                  },
                },
              ],
            },
          ],
        },
      },
    }
    store = {
      subscribe: jest.fn(),
      dispatch: jest.fn(),
      getState: jest.fn(() => state),
    }

    props = {
      sellerId: '1',
      items: [
        {
          seller: '1',
          name: 'test',
          imageUrl: 'test.png',
          uniqueId: 'xablau',
        },
        {
          seller: '1',
          name: 'test2',
          imageUrl: 'test2.png',
          uniqueId: 'xablau2',
        },
      ],
      unavailableItems: [
        {
          name: 'test3',
          imageUrl: 'test2.png',
          uniqueId: 'xablau3',
        },
      ],
      isSelectedSla: false,
      unavailableItemsAmount: 1,
      storePreferencesData: {
        countryCode: 'BRA',
        currencyCode: 'BRL',
        currencySymbol: 'R$',
        currencyFormatInfo: {
          currencyDecimalDigits: 2,
          currencyDecimalSeparator: ',',
          currencyGroupSeparator: '.',
          currencyGroupSize: 3,
          startsWithCurrencySymbol: true,
        },
      },
      bestPickupOptions: [],
      pickupPointId: '2',
      pickupOptionGeolocations: [
        [123, 123],
        [123, 123],
      ],
      googleMapsKey: '1234',
      address: addValidation({
        addressType: 'residential',
        receiverName: null,
        addressId: '10',
        postalCode: '22222222',
        city: 'Rio de janeiro',
        state: 'RJ',
        country: 'BRA',
        street: 'Av das Américas',
        number: '',
        neighborhood: 'Barra da Tijuca',
        complement: 'Loja Barra da Tijuca',
        reference: null,
        geoCoordinates: [],
        addressQuery: 'query',
      }),
      pickupPoint: {
        name: 'test',
        price: 100,
        shippingEstimate: '1bd',
        deliveryChannel: PICKUP_IN_STORE,
        id: '1',
        pickupDistance: 10000,
        pickupStoreInfo: {
          friendlyName: 'test',
          address: {
            addressId: '10',
            addressType: 'residential',
          },
          additionalInfo: 'test aditionalInfo',
        },
      },
      selectedRules: BRA,
      handleChangeActiveSLAOption,
      handleClosePickupPointsModal,
      togglePickupDetails,
      logisticsInfo: [],
      pickupPointInfo: {},
      shouldUseMaps: true,
    }
  })

  it('should render self and components', () => {
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <ModalStateContext.Provider value={modalState}>
            <IntlProvider
              locale="pt"
              messages={{ ...messages, 'country.BRA': 'BRA' }}
            >
              <PickupPointDetails {...props} />
            </IntlProvider>
          </ModalStateContext.Provider>
        </Provider>
      )
      .toJSON()

    expect(wrapper).toMatchSnapshot()
  })

  it('should simulate go back to list of pickups', () => {
    render(
      <Provider store={store}>
        <ModalStateContext.Provider value={modalState}>
          <PickupPointDetails {...props} />
        </ModalStateContext.Provider>
      </Provider>
    )

    const backButton = screen.getByRole('button', {
      name: 'See all Pick Up In Store sites',
    })

    userEvent.click(backButton)

    expect(setActiveSidebarState).toHaveBeenCalledTimes(1)
  })

  it('should simulate confirm a pickupPoint', () => {
    jest.useFakeTimers()

    render(
      <ModalStateContext.Provider value={modalState}>
        <PickupPointDetails {...props} />
      </ModalStateContext.Provider>
    )

    const confirmButton = screen.getByRole('button', {
      name: 'Select this store',
    })

    userEvent.click(confirmButton)

    jest.runAllTimers()

    expect(handleClosePickupPointsModal).toHaveBeenCalledTimes(1)
  })

  it('should show the right info about the selected pickup point', () => {
    const { queryByText, getByTestId } = render(
      <ModalState
        activePickupPoint={undefined}
        address={address}
        residentialAddress={undefined}
        askForGeolocation={false}
        googleMapsKey="1234"
        isSearching={false}
        items={state.orderForm.items}
        mapStatus="HIDE_MAP"
        logisticsInfo={modalState.logisticsInfo}
        pickupPoints={modalState.pickupPoints}
        pickupOptions={modalState.pickupOptions}
        salesChannel={undefined}
        orderFormId={undefined}
        selectedPickupPoint={modalState.selectedPickupPoint}
      >
        <PickupPointDetails {...props} />
      </ModalState>
    )

    expect(queryByText('Loja VTEX')).toBeTruthy()
    expect(queryByText('3:00 AM')).toBeTruthy()
    expect(queryByText('11:30 AM')).toBeTruthy()

    const nextPickupPointButton = getByTestId('goToNextPickupPoint')
    const previousPickupPointButton = getByTestId('goToPreviousPickupPoint')

    userEvent.click(nextPickupPointButton)

    expect(queryByText('Loja VTEX')).toBeFalsy()
    expect(queryByText('3:00 AM')).toBeFalsy()
    expect(queryByText('11:30 AM')).toBeFalsy()

    expect(queryByText('Outra Loja')).toBeTruthy()
    expect(queryByText('4:00 PM')).toBeTruthy()
    expect(queryByText('10:30 PM')).toBeTruthy()

    userEvent.click(previousPickupPointButton)

    expect(queryByText('Outra Loja')).toBeFalsy()
    expect(queryByText('4:00 PM')).toBeFalsy()
    expect(queryByText('10:30 PM')).toBeFalsy()

    expect(queryByText('Loja VTEX')).toBeTruthy()
    expect(queryByText('3:00 AM')).toBeTruthy()
    expect(queryByText('11:30 AM')).toBeTruthy()
  })
})
