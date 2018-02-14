import React from 'react'
import ConnectedPickupPointDetails, {
  PickupPointDetails,
} from './PickupPointDetails'
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
import { PICKUP, DELIVERY } from '../constants'
import { PICKUP_IN_STORE } from '../constants/index'
import { fixImageUrl } from '../utils/Images'

loadTranslation('./src/locales/pt.json')
setLocale('pt')
jest.mock('../utils/Images', () => ({
  fixImageUrl: () => 'teste.png',
}))
describe('PickupPointDetails', () => {
  let state,
    store,
    props,
    changeActiveSLAOption,
    closePickupModal,
    closePickupDetails,
    updateShippingData

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
    changeActiveSLAOption = jest.fn()
    closePickupModal = jest.fn()
    closePickupDetails = jest.fn()

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
      changeActiveSLAOption,
      closePickupModal,
      closePickupDetails,
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
        pickupStoreInfo: {
          friendlyName: 'test',
          friendlyName: 'test',
          address: {
            addressId: '10',
            addressType: 'residential',
          },
          additionalInfo: 'test aditionalInfo',
        },
      },
      selectedRules: BRA,
    }
  })

  it('should render self and components', () => {
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <IntlContainer store={store}>
            <ConnectedPickupPointDetails {...props} />
          </IntlContainer>
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('should simulate go back to list of pickups', () => {
    const wrapper = shallowWithIntl(<PickupPointDetails {...props} />)

    const backLink = wrapper.find('button.link-back-pickup-points-list')

    backLink.simulate('click')

    expect(closePickupDetails.mock.calls).toHaveLength(1)
  })

  it('should simulate confirm a pickupPoint', () => {
    const wrapper = shallowWithIntl(<PickupPointDetails {...props} />)

    const confirmButton = wrapper.find('button.pickup-point-details-confirm')

    confirmButton.simulate('click')

    expect(closePickupDetails.mock.calls).toHaveLength(1)
    expect(closePickupModal.mock.calls).toHaveLength(1)
    expect(changeActiveSLAOption.mock.calls).toHaveLength(1)
  })
})
