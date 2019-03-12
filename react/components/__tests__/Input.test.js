import React from 'react'
import IntlInput, { Input } from '../Input'
import { shallowWithIntl, loadTranslation, setLocale } from 'enzyme-react-intl'
import { Provider } from 'react-redux'
import IntlContainer from '../../containers/IntlContainer'
import renderer from 'react-test-renderer'

loadTranslation('./messages/pt.json')
setLocale('pt')

describe('Input', () => {
  let state, store, props, onChange

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
            <IntlInput {...props} />
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
            <IntlInput {...props} />
          </IntlContainer>
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('should simulate onChange', () => {
    const wrapper = shallowWithIntl(<Input {...props} />)

    wrapper.simulate('change', {
      target: {
        value: '',
      },
    })

    expect(onChange.mock.calls).toHaveLength(1)
  })
})
