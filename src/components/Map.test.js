import React from 'react'
import { shallow, mount } from 'enzyme'
import Map from './Map'

describe('Map', () => {
  let shallowWrapper, shallowInstance

  function shallowRenderComponent() {
    shallowWrapper = shallow(
      <Map
        loadingElement={<div />}
        rules={{}}
        isPickupDetailsActive={false}
        onChangeAddress={jest.fn()}
        handleAskForGeolocation={jest.fn()}
        loadingGoogle
        googleMaps={null}
        changeActivePickupDetails={jest.fn()}
        pickupOptions={[]}
        pickupPointId="1"
        address={{
          geoCoordinates: {
            value: [],
          },
        }}
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
        loadingElement={<div />}
        rules={{}}
        onChangeAddress={jest.fn()}
        handleAskForGeolocation={jest.fn()}
        loadingGoogle
        isPickupDetailsActive={false}
        googleMaps={null}
        changeActivePickupDetails={jest.fn()}
        pickupOptions={[]}
        address={{
          geoCoordinates: {
            value: [],
          },
        }}
        pickupPointId="1"
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

  it('should re-render if loadingGoogle changed', () => {
    const currentProps = shallowInstance.props
    const currentState = shallowInstance.state

    const shouldUpdate = shallowInstance.shouldComponentUpdate(
      { ...currentProps, loadingGoogle: false },
      currentState
    )

    expect(shouldUpdate).toBe(true)
  })
})
