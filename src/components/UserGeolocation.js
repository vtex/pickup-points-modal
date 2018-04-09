import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'

import styles from '../index.css'

import { searchPickupAddressByGeolocationEvent } from '../utils/metrics'
import { SEARCHING, WAITING, HTTPS } from '../constants'
import {
  getCurrentPosition,
  handleGetAddressByGeolocation,
} from '../utils/CurrentPosition'
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

  componentDidMount() {
    if (this.props.askForGeolocation) {
      this.handleGetCurrentPosition()
    }
  }

  handleGetCurrentPosition = () => {
    this.props.handleGeolocationStatus(WAITING)
    if (window.location.host.includes(VTEXLOCAL)) {
      this.props.handleAskForGeolocation(false)
      return
    }
    this.props.onGetGeolocation()
    this.props.googleMaps &&
      getCurrentPosition(
        position => {
          handleGetAddressByGeolocation({
            newPosition: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            geocoder: this.geocoder,
            googleMaps: this.props.googleMaps,
            onChangeAddress: this.props.onChangeAddress,
            rules: this.props.rules,
            address: this.address,
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
