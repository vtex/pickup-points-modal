import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'

import { components } from 'vtex.address-form'

const { GoogleMapsContainer } = components

export function withGoogleMaps(ComponentToWrap) {
  return class withGoogleMapsClass extends Component {
    static propTypes = {
      googleMapsKey: PropTypes.string,
      intl: intlShape,
    }

    render() {
      const { googleMapsKey, intl } = this.props

      if (!googleMapsKey) {
        return (
          <ComponentToWrap
            {...this.props}
            googleMaps={null}
            loading={false}
            shouldUseMaps={false}
          />
        )
      }

      return (
        <GoogleMapsContainer apiKey={googleMapsKey} locale={intl.locale}>
          {({ loading, googleMaps }) =>
            loading ? null : (
              <ComponentToWrap
                {...this.props}
                googleMaps={googleMaps}
                loading={loading}
                shouldUseMaps={googleMapsKey && googleMaps}
              />
            )
          }
        </GoogleMapsContainer>
      )
    }
  }
}
