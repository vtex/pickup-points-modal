import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'

import GoogleMapsContainer from '@vtex/address-form/lib/geolocation/GoogleMapsContainer'

export function withGoogleMaps(ComponentToWrap) {
  return class withGoogleMapsClass extends Component {
    static propTypes = {
      googleMapsKey: PropTypes.string,
      intl: intlShape,
    }

    render() {
      const { googleMapsKey, intl } = this.props
      return (
        <GoogleMapsContainer apiKey={googleMapsKey} locale={intl.locale}>
          {({ loading, googleMaps }) =>
            loading ? null : (
              <ComponentToWrap
                {...this.props}
                googleMaps={googleMaps}
                loading={loading}
              />
            )
          }
        </GoogleMapsContainer>
      )
    }
  }
}
