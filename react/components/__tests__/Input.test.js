import React from 'react'
import { shallow } from 'enzyme'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import { IntlProvider } from 'react-intl'

import messages from '../../../messages/pt-BR.json'
import IntlContainer from '../../containers/IntlContainer'
import Input from '../Input'

describe('Input', () => {
  let state
  let store
  let props
  let onChange

  beforeEach(() => {
    onChange = jest.fn()
    state = {
      orderForm: {
        clientPreferencesData: {
          locale: 'pt-BR',
        },
      },
    }
    store = {
      subscribe: jest.fn(),
      dispatch: jest.fn(),
      getState: jest.fn(() => state),
    }

    props = {
      clientPreferencesData: {
        locale: 'pt-BR',
      },
      onChange,
      address: {
        addressId: {
          value: '10',
        },
        addressType: {
          value: 'residential',
        },
        postalCode: {
          value: '',
        },
        city: {
          value: 'Rio de Janeiro',
        },
        complement: {
          value: '',
        },
        neighborhood: {
          value: '',
        },
        number: {
          value: '',
        },
        receiverName: {
          value: '',
        },
        reference: {
          value: '',
        },
        state: {
          value: 'Rio de Janeiro',
        },
        street: {
          value: 'Praia de Botafogo',
        },
        addressQuery: {
          value: 'Praia de Botafogo',
        },
        country: {
          value: 'BRA',
        },
        geoCoordinates: {
          value: [123, 123],
        },
      },
    }
  })

  it('should render self and components', () => {
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <IntlContainer store={store}>
            <Input {...props} />
          </IntlContainer>
        </Provider>
      )
      .toJSON()

    expect(wrapper).toMatchSnapshot()
  })

  it('should render self and components with addressQuery', () => {
    state = {
      orderForm: {
        googleMapsKey: '1234',
        clientPreferencesData: {
          locale: 'pt-BR',
        },
      },
    }

    props = {
      clientPreferencesData: {
        locale: 'pt-BR',
      },
      onChange,
      address: {
        addressId: {
          value: '10',
        },
        addressType: {
          value: 'residential',
        },
        postalCode: {
          value: '1234',
        },
        city: {
          value: 'Rio de Janeiro',
        },
        complement: {
          value: '',
        },
        neighborhood: {
          value: '',
        },
        number: {
          value: '',
        },
        receiverName: {
          value: '',
        },
        reference: {
          value: '',
        },
        state: {
          value: 'Rio de Janeiro',
        },
        street: {
          value: 'Praia de Botafogo',
        },
        addressQuery: {
          value: '123412',
        },
        country: {
          value: 'BRA',
        },
        geoCoordinates: {
          value: [123, 123],
        },
      },
    }
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <IntlContainer store={store}>
            <Input {...props} />
          </IntlContainer>
        </Provider>
      )
      .toJSON()

    expect(wrapper).toMatchSnapshot()
  })

  it('should simulate onChange', () => {
    const wrapper = shallow(
      <IntlProvider
        locale="pt"
        messages={{ ...messages, 'country.BRA': 'BRA' }}
      >
        <Input {...props} />
      </IntlProvider>
    )

    wrapper.simulate('change', {
      target: {
        value: '',
      },
    })

    expect(onChange.mock.calls).toHaveLength(1)
  })
})
