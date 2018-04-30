import React from 'react'
import { shallow } from 'enzyme'
import Map from './Map'

describe('Map', () => {
  let shallowWrapper, shallowInstance

  function shallowRenderComponent() {
    shallowWrapper = shallow(
      <Map
        address={{
          geoCoordinates: {
            value: [],
          },
        }}
        changeActivePickupDetails={jest.fn()}
        googleMaps={null}
        handleAskForGeolocation={jest.fn()}
        isLoadingGoogle
        isPickupDetailsActive={false}
        loadingElement={<div />}
        onChangeAddress={jest.fn()}
        pickupOptions={[]}
        pickupPointId="1"
        rules={{}}
      />
    )

    shallowInstance = shallowWrapper.instance()
  }

  beforeEach(() => {
    shallowRenderComponent()
  })

  it('should render without crashing', () => {
    shallow(
      <Map
        address={{
          geoCoordinates: {
            value: [],
          },
        }}
        changeActivePickupDetails={jest.fn()}
        googleMaps={null}
        handleAskForGeolocation={jest.fn()}
        isLoadingGoogle
        isPickupDetailsActive={false}
        loadingElement={<div />}
        onChangeAddress={jest.fn()}
        pickupOptions={[]}
        pickupPointId="1"
        rules={{}}
      />
    )
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
