import React from 'react'
import { shallow } from 'enzyme'
import Map from './Map'
import { PICKUP_IN_STORE } from '../constants/index'

describe('Map', () => {
  let shallowWrapper, shallowInstance

  const defaultProps = {
    activatePickupDetails: jest.fn(),
    changeActivePickupDetails: jest.fn(),
    handleAskForGeolocation: jest.fn(),
    onChangeAddress: jest.fn(),
    googleMaps: null,
    isLoadingGoogle: true,
    isPickupDetailsActive: false,
    loadingElement: <div />,
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
    pickupPointId: '1',
    rules: {},
    address: {
      addressId: { value: '123' },
      addressType: { value: 'search' },
      geoCoordinates: { value: [] },
      city: { value: 'Rio' },
      complement: { value: 'apto 102' },
      country: { value: 'BRA' },
      neighborhood: { value: 'Botafogo' },
      number: { value: '' },
      state: { value: '' },
      postalCode: { value: '' },
      receiverName: { value: '' },
      reference: { value: '' },
      street: { value: '' },
      addressQuery: { value: '' },
    },
  }

  function shallowRenderComponent() {
    shallowWrapper = shallow(<Map {...defaultProps} />)

    shallowInstance = shallowWrapper.instance()
  }

  beforeEach(() => {
    shallowRenderComponent()
  })

  it('should render without crashing', () => {
    shallow(<Map {...defaultProps} />)
  })

  it("should not re-render if rules and geoCoords didn't change", () => {
    const currentProps = shallowInstance.props
    const currentState = shallowInstance.state

    const shouldUpdate = shallowInstance.shouldComponentUpdate(
      currentProps,
      currentState
    )

    expect(shouldUpdate).toBe(false)
  })

  it('should re-render if rules changed', () => {
    const currentProps = shallowInstance.props
    const currentState = shallowInstance.state

    const shouldUpdate = shallowInstance.shouldComponentUpdate(
      { ...currentProps, rules: { country: 'USA' } },
      currentState
    )

    expect(shouldUpdate).toBe(true)
  })

  it('should re-render if isLoadingGoogle changed', () => {
    const currentProps = shallowInstance.props
    const currentState = shallowInstance.state

    const shouldUpdate = shallowInstance.shouldComponentUpdate(
      { ...currentProps, isLoadingGoogle: false },
      currentState
    )

    expect(shouldUpdate).toBe(true)
  })
})
