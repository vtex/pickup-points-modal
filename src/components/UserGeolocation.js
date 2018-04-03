import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import geolocationAutoCompleteAddress from '@vtex/address-form/lib/geolocation/geolocationAutoCompleteAddress'
import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'

import styles from '../index.css'

import { searchPickupAddressByGeolocationEvent } from '../utils/metrics'
import { SEARCHING, WAITING, HTTPS } from '../constants'

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
    this.props.handleGeolocationStatus(WAITING)
    if (window.location.protocol !== HTTPS) {
      this.props.handleAskForGeolocation(false)
      return
    }
    this.props.onGetGeolocation()
    this.props.googleMaps &&
      navigator.geolocation.getCurrentPosition(
        position => {
          this.handleGetAddressByGeolocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          this.props.handleGeolocationStatus(SEARCHING)
          searchPickupAddressByGeolocationEvent({
            searchedAddressByGeolocation: true,
            confirmedGeolocation: true,
          })
        },
        error => {
          switch (error.code) {
            case 0: // UNKNOWN ERROR
              this.props.handleAskForGeolocation(false)
              searchPickupAddressByGeolocationEvent({
                confirmedGeolocation: true,
                browserError: true,
              })
              break
            case 1: // PERMISSION_DENIED
              this.props.handleAskForGeolocation(false)
              searchPickupAddressByGeolocationEvent({
                deniedGeolocation: true,
              })
              break
            case 2: // POSITION_UNAVAILABLE
              this.props.handleAskForGeolocation(false)
              searchPickupAddressByGeolocationEvent({
                confirmedGeolocation: true,
                positionUnavailable: true,
              })
              break
            case 3: // TIMEOUT
              this.props.handleAskForGeolocation(false)
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
        onChangeAddress({
          ...autoCompletedAddress,
          complement: {
            value: null,
          },
          reference: {
            value: null,
          },
        })
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
      <button
        type="button"
        className="btn-ask-for-geolocation-cta btn btn-success btn-large"
        id="ask-geolocation-button"
        onClick={this.handleGetCurrentPosition}
      >
        {this.translate('askGeolocation')}
      </button>
    )
  }
}

UserGeolocation.propTypes = {
  address: AddressShapeWithValidation,
  googleMaps: PropTypes.object,
  intl: intlShape,
  onChangeAddress: PropTypes.func.isRequired,
  onGetGeolocation: PropTypes.func.isRequired,
  handleAskForGeolocation: PropTypes.func.isRequired,
  pickupOptionGeolocations: PropTypes.array,
  rules: PropTypes.object,
}

export default injectIntl(UserGeolocation)
