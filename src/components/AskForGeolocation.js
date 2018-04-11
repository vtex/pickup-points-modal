import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import {
  getCurrentPosition,
  handleGetAddressByGeolocation,
} from '../utils/CurrentPosition'
import { searchPickupAddressByGeolocationEvent } from '../utils/metrics'

import UserGeolocation from '../components/UserGeolocation'
import GeolocationPin from '../assets/components/GeolocationPin'
import WaitingPin from '../assets/components/WaitingPin'
import SearchingPin from '../assets/components/SearchingPin'

import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'

import './GeolocationStatus.css'

import { WAITING, SEARCHING, ASK, VTEXLOCAL } from '../constants'
import GeolocationStatus from './GeolocationStatus'

export class AskForGeolocation extends Component {
  componentDidMount() {
    this.handleGetCurrentPosition(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.handleGetCurrentPosition(nextProps)
  }

  handleGetCurrentPosition = props => {
    if (props.askForGeolocation && props.status === WAITING) {
      this.handleGeolocationStatus(WAITING)

      // Hard coded coords for development
      if (window.location.host.includes(VTEXLOCAL)) {
        this.getCurrentPositionSuccess({
          coords: {
            latitude: -22.9432587,
            longitude: -43.1862642,
          },
        })
        return
      }
      props.googleMaps &&
        getCurrentPosition(
          this.getCurrentPositionSuccess,
          this.getCurrentPositionError
        )
    }
  }

  getCurrentPositionSuccess = position => {
    handleGetAddressByGeolocation({
      newPosition: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      geocoder: this.geocoder,
      googleMaps: this.props.googleMaps,
      onChangeAddress: this.props.onChangeAddress,
      rules: this.props.rules,
      address: this.props.address,
    })
    this.handleGeolocationStatus(SEARCHING)
    searchPickupAddressByGeolocationEvent({
      searchedAddressByGeolocation: true,
      confirmedGeolocation: true,
    })
  }

  getCurrentPositionError = error => {
    switch (error.code) {
      case 0: // UNKNOWN ERROR
        this.props.onAskForGeolocation(false)
        searchPickupAddressByGeolocationEvent({
          confirmedGeolocation: true,
          browserError: true,
        })
        break
      case 1: // PERMISSION_DENIED
        this.props.onAskForGeolocation(false)
        searchPickupAddressByGeolocationEvent({
          deniedGeolocation: true,
        })
        break
      case 2: // POSITION_UNAVAILABLE
        this.props.onAskForGeolocation(false)
        searchPickupAddressByGeolocationEvent({
          confirmedGeolocation: true,
          positionUnavailable: true,
        })
        break
      case 3: // TIMEOUT
        this.props.onAskForGeolocation(false)
        searchPickupAddressByGeolocationEvent({
          dismissedGeolocation: true,
        })
        break
      default:
        return false
    }
  }

  handleGeolocationStatus = status => {
    this.props.onAskForGeolocationStatus(status)
  }

  handleAskForGeolocationButtonClick = () => {
    this.props.onAskForGeolocationStatus(WAITING)
  }

  handleManualGeolocation = () => {
    this.props.onAskForGeolocation(false)
  }

  translate = id =>
    this.props.intl.formatMessage({
      id: `pickupPointsModal.${id}`,
    })

  render() {
    const { status } = this.props

    return (
      <div className="pkpmodal-ask-for-geolocation">
        {status === ASK && (
          <GeolocationStatus
            titleTop="geolocationDiscover"
            subtitleTop="geolocationAsk"
            Image={() => (
              <div className="pkpmodal-ask-for-geolocation-image-ask">
                <GeolocationPin />
              </div>
            )}
          >
            <div>
              <div className="ask-for-geolocation-cta">
                <button
                  className="btn-ask-for-geolocation-cta btn btn-success btn-large"
                  onClick={this.handleAskForGeolocationButtonClick}
                >
                  {this.translate('askGeolocationAccept')}
                </button>
              </div>
              <div className="pkpmodal-ask-for-geolocation-manual">
                <button
                  type="button"
                  onClick={this.handleManualGeolocation}
                  className="btn-pkpmodal-ask-for-geolocation-manual btn btn-link"
                >
                  {this.translate('geolocationManual')}
                </button>
              </div>
            </div>
          </GeolocationStatus>
        )}

        {status === WAITING && (
          <GeolocationStatus
            titleBottom="geolocationWaiting"
            subtitleBottom="geolocationAllow"
            Image={() => (
              <div>
                <div className="pkpmodal-ask-for-geolocation-image-waiting">
                  <WaitingPin />
                </div>
                <div className="pkpmodal-ask-for-geolocation-image-waiting-shadow" />
              </div>
            )}
          />
        )}

        {status === SEARCHING && (
          <GeolocationStatus
            titleBottom="geolocationSearching"
            Image={() => (
              <div>
                <div className="pkpmodal-ask-for-geolocation-image-searching">
                  <SearchingPin />
                </div>
                <div className="pkpmodal-ask-for-geolocation-image-searching-shadow" />
              </div>
            )}
          />
        )}
      </div>
    )
  }
}

AskForGeolocation.propTypes = {
  address: AddressShapeWithValidation,
  askForGeolocation: PropTypes.bool,
  googleMaps: PropTypes.object,
  intl: intlShape,
  onChangeAddress: PropTypes.func.isRequired,
  onAskForGeolocation: PropTypes.func.isRequired,
  onAskForGeolocationStatus: PropTypes.func.isRequired,
  pickupOptionGeolocations: PropTypes.array,
  rules: PropTypes.object,
  status: PropTypes.string.isRequired,
}

export default injectIntl(AskForGeolocation)
