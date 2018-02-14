import React from 'react'
import IntlPickupModal, { PickupModal } from './index'
import {
  mountWithIntl,
  shallowWithIntl,
  loadTranslation,
  setLocale,
} from 'enzyme-react-intl'
import { Provider } from 'react-redux'
import IntlContainer from '../containers/IntlContainer'
import renderer from 'react-test-renderer'
import { addValidation } from '@vtex/address-form'
import BRA from '@vtex/address-form/lib/country/BRA'
import { PICKUP, DELIVERY } from './constants'
import { PICKUP_IN_STORE } from './constants/index'

loadTranslation('./src/locales/pt.json')
setLocale('pt')

describe('PickupModal', () => {
  let state, store, props
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
    state = {
      addressForm: {
        addresses: {
          '10': addValidation(address),
          '11': addValidation({
            ...address,
            addressId: '11',
          }),
        },
        residentialId: '11',
        searchId: '10',
      },
      componentActivity: {
        activeDeliveryChannel: PICKUP_IN_STORE,
      },
      accountInfo: {
        acceptSearchKeys: [],
      },
      pickup: {
        isPickupDetailsActive: false,
        pickupPointId: '1',
        activeSellerId: '1',
        pickupOptions: [
          {
            name: 'test',
            price: 100,
            shippingEstimate: '1bd',
            pickupStoreInfo: {
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
        isGeolocationInput: false,
        googleMapsKey: '1234',
        clientPreferencesData: {
          locale: 'pt-BR',
        },
        items: [{ seller: '1' }],
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
              selectedSla: '1',
              deliveryChannels: [{ id: DELIVERY }],
              slas: [
                {
                  name: 'test',
                  price: 100,
                  shippingEstimate: '1bd',
                  deliveryChannel: PICKUP_IN_STORE,
                  id: '1',
                  pickupStoreInfo: {
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
      updateAddressForm: jest.fn(),
      searchedPickupAddressEvent: jest.fn(),
      validateAddressForm: jest.fn(),
      togglePickupDetails: jest.fn(),
      changeActivePickupDetails: jest.fn(),
      updateShippingData: jest.fn(),
      isPickupDetailsActive: false,
      pickupOptionGeolocations: [[123, 123], [123, 123]],
      isGeolocationInput: false,
      googleMapsKey: '1234',
      address: addValidation(address),
      pickupPointId: '1',
      pickupOptions: [
        {
          name: 'test',
          price: 100,
          shippingEstimate: '1bd',
          deliveryChannel: PICKUP_IN_STORE,
          id: '1',
          pickupStoreInfo: { aditionalInfo: 'test', address },
        },
        {
          name: 'test',
          price: 100,
          shippingEstimate: '1bd',
          deliveryChannel: PICKUP_IN_STORE,
          id: '2',
          pickupStoreInfo: { aditionalInfo: 'test', address },
        },
      ],
      onChangeAddress: jest.fn(),
      selectedRules: BRA,
      changeActivePickupOptions: jest.fn(),
      closePickupModal: jest.fn(),
    }
  })

  it('should render self and components', () => {
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <IntlContainer store={store}>
            <IntlPickupModal {...props} />
          </IntlContainer>
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('should render self and components without Google Maps', () => {
    const props = {
      sellerId: '1',
      updateAddressForm: jest.fn(),
      searchedPickupAddressEvent: jest.fn(),
      validateAddressForm: jest.fn(),
      togglePickupDetails: jest.fn(),
      changeActivePickupDetails: jest.fn(),
      updateShippingData: jest.fn(),
      isPickupDetailsActive: false,
      pickupOptionGeolocations: [[123, 123], [123, 123]],
      isGeolocationInput: false,
      googleMapsKey: '1234',
      onChangeAddress: jest.fn(),
      selectedRules: BRA,
      address: addValidation(address),
      pickupPointId: '1',
      pickupOptions: [
        {
          name: 'test',
          price: 100,
          shippingEstimate: '1bd',
          deliveryChannel: PICKUP_IN_STORE,
          id: '1',
          pickupStoreInfo: { aditionalInfo: 'test', address },
        },
        {
          name: 'test',
          price: 100,
          shippingEstimate: '1bd',
          deliveryChannel: PICKUP_IN_STORE,
          id: '2',
          pickupStoreInfo: { aditionalInfo: 'test', address },
        },
      ],
      changeActivePickupOptions: jest.fn(),
      closePickupModal: jest.fn(),
    }
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <IntlContainer store={store}>
            <IntlPickupModal {...props} />
          </IntlContainer>
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('should simulate click on the close button', done => {
    const mockClosePickupModal = jest.fn()
    const updateShippingDataMock = jest.fn()

    const props = {
      searchAddress: addValidation(address),
      activeDeliveryChannel: PICKUP_IN_STORE,
      sellerId: '1',
      updateAddressForm: jest.fn(),
      searchedPickupAddressEvent: jest.fn(),
      validateAddressForm: jest.fn(),
      togglePickupDetails: jest.fn(),
      changeActivePickupDetails: jest.fn(),
      isPickupDetailsActive: false,
      pickupOptionGeolocations: [[123, 123], [123, 123]],
      isGeolocationInput: false,
      googleMapsKey: '1234',
      selectedPickupPointId: '1',
      address: addValidation(address),
      pickupPointId: '1',
      shippingData: {},
      pickupOptions: [
        {
          name: 'test',
          price: 100,
          shippingEstimate: '1bd',
          deliveryChannel: PICKUP_IN_STORE,
          id: '1',
          pickupStoreInfo: { aditionalInfo: 'test', address },
        },
        {
          name: 'test',
          price: 100,
          shippingEstimate: '1bd',
          deliveryChannel: PICKUP_IN_STORE,
          id: '2',
          pickupStoreInfo: { aditionalInfo: 'test', address },
        },
      ],
      onChangeAddress: jest.fn(),
      selectedRules: BRA,
      changeActivePickupOptions: jest.fn(),
      closePickupModal: mockClosePickupModal,
      updateShippingData: updateShippingDataMock,
    }

    const wrapper = shallowWithIntl(<PickupModal {...props} />)
    process.nextTick(() => {
      try {
        wrapper.update()
        const closeButton = wrapper.find('button')

        closeButton.simulate('click')

        expect(mockClosePickupModal.mock.calls).toHaveLength(1)
      } catch (e) {
        return done(e)
      }
      done()
    })
  })

  it('should simulate click on the close button', () => {
    const mockClosePickupModal = jest.fn()

    const props = {
      searchAddress: addValidation(address),
      activeDeliveryChannel: PICKUP_IN_STORE,
      sellerId: '1',
      updateAddressForm: jest.fn(),
      searchedPickupAddressEvent: jest.fn(),
      validateAddressForm: jest.fn(),
      togglePickupDetails: jest.fn(),
      changeActivePickupDetails: jest.fn(),
      updateShippingData: jest.fn(),
      isPickupDetailsActive: false,
      pickupOptionGeolocations: [[123, 123], [123, 123]],
      isGeolocationInput: false,
      googleMapsKey: '1234',
      address: addValidation(address),
      pickupPointId: '1',
      shippingData: {},
      pickupOptions: [
        {
          name: 'test',
          price: 100,
          shippingEstimate: '1bd',
          deliveryChannel: PICKUP_IN_STORE,
          id: '1',
          pickupStoreInfo: { aditionalInfo: 'test', address },
        },
        {
          name: 'test',
          price: 100,
          shippingEstimate: '1bd',
          deliveryChannel: PICKUP_IN_STORE,
          id: '2',
          pickupStoreInfo: { aditionalInfo: 'test', address },
        },
      ],
      onChangeAddress: jest.fn(),
      selectedRules: BRA,
      changeActivePickupOptions: jest.fn(),
      closePickupModal: mockClosePickupModal,
    }

    const wrapper = shallowWithIntl(<PickupModal {...props} />)

    const closeButton = wrapper.find('button')

    closeButton.simulate('click')

    expect(mockClosePickupModal.mock.calls).toHaveLength(1)
  })

  it('should simulate click change tab', done => {
    const mockClosePickupModal = jest.fn()

    const props = {
      sellerId: '1',
      updateAddressForm: jest.fn(),
      searchedPickupAddressEvent: jest.fn(),
      validateAddressForm: jest.fn(),
      togglePickupDetails: jest.fn(),
      changeActivePickupDetails: jest.fn(),
      updateShippingData: jest.fn(),
      isPickupDetailsActive: false,
      pickupOptionGeolocations: [[123, 123], [123, 123]],
      isGeolocationInput: false,
      googleMapsKey: '1234',
      address: addValidation(address),
      onChangeAddress: jest.fn(),
      selectedRules: BRA,
      pickupPointId: '1',
      pickupOptions: [
        {
          name: 'test',
          price: 100,
          shippingEstimate: '1bd',
          deliveryChannel: PICKUP_IN_STORE,
          id: '1',
          pickupStoreInfo: {
            friendlyName: 'test',
            address,
            additionalInfo: 'test aditionalInfo',
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
            additionalInfo: 'test aditionalInfo',
          },
        },
      ],
      changeActivePickupOptions: jest.fn(),
      closePickupModal: mockClosePickupModal,
    }

    const wrapper = mountWithIntl(
      <Provider store={store}>
        <IntlPickupModal {...props} />
      </Provider>
    )

    const listButton = wrapper.find('button.pickup-view-list')

    listButton.simulate('click')
    process.nextTick(() => {
      try {
        wrapper.update()
        expect(listButton.hasClass('blue')).toBe(true)
      } catch (e) {
        return done(e)
      }
      done()
    })
  })
})
