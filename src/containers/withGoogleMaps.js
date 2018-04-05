import React, { Component } from 'react'

import GoogleMapsContainer from '@vtex/address-form/lib/geolocation/GoogleMapsContainer'

export function withGoogleMaps(ComponentToWrap) {
  return class extends Component {
    render() {
      const { googleMapsKey, intl } = this.props
      return (
        <GoogleMapsContainer apiKey={googleMapsKey} locale={intl.locale}>
          {({ loading, googleMaps }) =>
            loading ? null : (
              <ComponentToWrap
                {...this.props}
                loading={loading}
                googleMaps={googleMaps}
              />
            )
          }
        </GoogleMapsContainer>
      )
    }
  }
}
