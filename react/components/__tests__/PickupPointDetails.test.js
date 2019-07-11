import React from 'react'
import PickupPointDetails from '../PickupPointDetails'

import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import renderer from 'react-test-renderer'
import { addValidation } from '@vtex/address-form'
import BRA from '@vtex/address-form/lib/country/BRA'
import { PICKUP, DELIVERY, PICKUP_IN_STORE, SIDEBAR } from '../../constants'
import messages from '../../../messages/en.json'
import { ModalStateContext } from '../../modalStateContext'
jest.mock('../../utils/Images', () => ({
  fixImageUrl: () => 'teste.png',
}))
describe('PickupPointDetails', () => {
  let state,
    store,
    props,
    handleChangeActiveSLAOption,
    handleClosePickupPointsModal,
    togglePickupDetails

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
    geoCoordinates: [],
    addressQuery: 'query',
  }

  beforeEach(() => {
    handleChangeActiveSLAOption = jest.fn()
    handleClosePickupPointsModal = jest.fn()
    togglePickupDetails = jest.fn()

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
                  name: 'test',
                  price: 100,
                  shippingEstimate: '1bd',
                  deliveryChannel: PICKUP_IN_STORE,
                  id: '3',
                  pickupStoreInfo: {
                    friendlyName: 'test',
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
      pickupPointId: '2',
      pickupOptionGeolocations: [[123, 123], [123, 123]],
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
    }
  })

  it('should render self and components', () => {
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <ModalStateContext.Provider
            value={{
              activeState: SIDEBAR,
              setActiveSidebarState: jest.fn(),
              shouldUseMaps: false,
              setSelectedPickupPoint: jest.fn(),
            }}>
            <IntlProvider
              locale="pt"
              messages={{ ...messages, ...{ 'country.BRA': 'BRA' } }}>
              <PickupPointDetails {...props} />
            </IntlProvider>
          </ModalStateContext.Provider>
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('should simulate go back to list of pickups', () => {
    const setActiveSidebarState = jest.fn()
    const wrapper = mount(
      <Provider store={store}>
        <ModalStateContext.Provider
          value={{
            activeState: SIDEBAR,
            setActiveSidebarState,
            shouldUseMaps: false,
            setSelectedPickupPoint: jest.fn(),
          }}>
          <IntlProvider
            locale="pt"
            messages={{ ...messages, ...{ 'country.BRA': 'BRA' } }}>
            <PickupPointDetails {...props} />
          </IntlProvider>
        </ModalStateContext.Provider>
      </Provider>
    )

    const backLink = wrapper.find('button.pkpmodal-details-back-lnk')

    backLink.simulate('click')

    expect(setActiveSidebarState.mock.calls).toHaveLength(1)
  })

  it('should simulate confirm a pickupPoint', () => {
    const wrapper = mount(
      <ModalStateContext.Provider
        value={{
          activeState: SIDEBAR,
          setActiveSidebarState: jest.fn(),
          shouldUseMaps: false,
          setSelectedPickupPoint: jest.fn(),
        }}>
        <IntlProvider
          locale="pt"
          messages={{ ...messages, ...{ 'country.BRA': 'BRA' } }}>
          <PickupPointDetails {...props} />
        </IntlProvider>
      </ModalStateContext.Provider>
    )

    const confirmButton = wrapper.find('.pkpmodal-details-confirm-btn')

    confirmButton.simulate('click')

    expect(handleChangeActiveSLAOption.mock.calls).toHaveLength(1)
    expect(handleClosePickupPointsModal.mock.calls).toHaveLength(1)
  })
})
