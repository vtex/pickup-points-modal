import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import geolocationAutoCompleteAddress from '@vtex/address-form/lib/geolocation/geolocationAutoCompleteAddress'

import styles from '../index.css'

import { searchPickupAddressByGeolocationEvent } from '../utils/metrics'

class UserGeolocation extends Component {
  componentWillUnmount() {
    this.setState({ isMounted: false })
    this.markerListeners &&
      this.markerListeners.forEach(item =>
        this.props.googleMaps.event.removeListener(item.markerListener)
      )
  }

  componentWillReceiveProps(nextProps) {
    this.address = nextProps.address
  }

  handleGetCurrentPosition = () => {
    this.props.googleMaps &&
      navigator.geolocation.getCurrentPosition(
        position => {
          this.handleGetAddressByGeolocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          searchPickupAddressByGeolocationEvent({
            searchedAddressByGeolocation: true,
            confirmedGeolocation: true,
          })
        },
        error => {
          switch (error.code) {
            case 0: // UNKNOWN ERROR
              searchPickupAddressByGeolocationEvent({
                confirmedGeolocation: true,
                browserError: true,
              })
              break
            case 1: // PERMISSION_DENIED
              searchPickupAddressByGeolocationEvent({
                deniedGeolocation: true,
              })
              break
            case 2: // POSITION_UNAVAILABLE
              searchPickupAddressByGeolocationEvent({
                confirmedGeolocation: true,
                positionUnavailable: true,
              })
              break
            case 3: // TIMEOUT
              searchPickupAddressByGeolocationEvent({
                dismissedGeolocation: true,
              })
              break
            default:
              return false
          }
        },
        { maximumAge: 50000, timeout: 20000, enableHighAccuracy: true }
      )
  }

  handleGetAddressByGeolocation = newPosition => {
    if (!this.geocoder) {
      this.geocoder = new this.props.googleMaps.Geocoder()
    }

    this.geocoder.geocode(
      { location: newPosition },
      this.handleAutocompleteAddress
    )
  }

  handleAutocompleteAddress = (results, status) => {
    const { googleMaps, onChangeAddress, rules } = this.props

    if (status === googleMaps.GeocoderStatus.OK) {
      if (results[0]) {
        const googleAddress = results[0]
        const autoCompletedAddress = geolocationAutoCompleteAddress(
          this.address,
          googleAddress,
          rules
        )
        onChangeAddress(autoCompletedAddress)
      }
    } else {
      console.warn(`Google Maps Error: ${status}`)
    }
  }

  translate = id =>
    this.props.intl.formatMessage({
      id: `pickupPointsModal.${id}`,
    })

  render() {
    return (
      <div className="PickupModalAsk">
        <a
          type="button"
          className="button-ask-geolocation btn btn-link f6 blue no-underline"
          id="ask-geolocation-button"
          onClick={this.handleGetCurrentPosition}
        >
          {this.translate('askGeolocation')}
        </a>
      </div>
    )
  }
}

UserGeolocation.propTypes = {
  address: PropTypes.object,
  googleMaps: PropTypes.object,
  intl: intlShape,
  onChangeAddress: PropTypes.func.isRequired,
  pickupOptionGeolocations: PropTypes.array,
  rules: PropTypes.object,
}

export default injectIntl(UserGeolocation)
