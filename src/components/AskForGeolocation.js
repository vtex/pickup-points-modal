import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import {
  getCurrentPosition,
  handleGetAddressByGeolocation,
} from '../utils/CurrentPosition'
import { translate } from '../utils/i18nUtils'
import { searchPickupAddressByGeolocationEvent } from '../utils/metrics'

import PinGeolocation from '../assets/components/PinGeolocation'
import PinWaiting from '../assets/components/PinWaiting'
import PinSearching from '../assets/components/PinSearching'
import Button from './Button'

import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'

import './AskForGeolocation.css'

import {
  WAITING,
  SEARCHING,
  ASK,
  VTEXLOCAL,
  LOCALHOST,
  ERROR_NOT_ALLOWED,
  ERROR_COULD_NOT_GETLOCATION,
  GRANTED,
} from '../constants'
import GeolocationStatus from './GeolocationStatus'

export class AskForGeolocation extends Component {
  componentDidMount() {
    this.handleGetCurrentPosition(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.askForGeolocation !== nextProps.askForGeolocation ||
      this.props.status !== nextProps.status
    ) {
      this.handleGetCurrentPosition(nextProps)
    }
  }

  handleGetCurrentPosition = props => {
    if (props.askForGeolocation && props.status === WAITING) {
      navigator.permissions &&
        navigator.permissions
          .query({ name: 'geolocation' })
          .then(permission => {
            this.handleCurrentPosition({
              permission,
              googleMaps: props.googleMaps,
            })
          })

      !navigator.permissions &&
        this.handleCurrentPosition({ googleMaps: props.googleMaps })
    }
  }

  handleCurrentPosition = ({ permission, googleMaps }) => {
    this.handleGeolocationStatus(
      (permission && permission.state === GRANTED) ||
      window.location.host.includes(VTEXLOCAL) ||
      window.location.host.includes(LOCALHOST)
        ? SEARCHING
        : WAITING
    )

    // Hard coded coords for development
    if (
      window.location.host.includes(VTEXLOCAL) ||
      window.location.host.includes(LOCALHOST)
    ) {
      this.getCurrentPositionSuccess({
        coords: {
          latitude: -22.9432587,
          longitude: -43.1862642,
        },
      })
      return
    }
    googleMaps &&
      getCurrentPosition(
        this.getCurrentPositionSuccess,
        this.getCurrentPositionError
      )
  }

  getCurrentPositionSuccess = position => {
    this.handleGeolocationStatus(SEARCHING)
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
    searchPickupAddressByGeolocationEvent({
      searchedAddressByGeolocation: true,
      confirmedGeolocation: true,
    })
  }

  getCurrentPositionError = error => {
    switch (error.code) {
      case 0: // UNKNOWN ERROR
        this.props.onGeolocationError(
          ERROR_COULD_NOT_GETLOCATION,
          this.props.geolocationFrom
        )
        searchPickupAddressByGeolocationEvent({
          confirmedGeolocation: true,
          browserError: true,
        })
        break
      case 1: // PERMISSION_DENIED
        this.props.onGeolocationError(
          ERROR_NOT_ALLOWED,
          this.props.geolocationFrom
        )
        searchPickupAddressByGeolocationEvent({
          deniedGeolocation: true,
        })
        break
      case 2: // POSITION_UNAVAILABLE
        this.props.onGeolocationError(
          ERROR_COULD_NOT_GETLOCATION,
          this.props.geolocationFrom
        )
        searchPickupAddressByGeolocationEvent({
          confirmedGeolocation: true,
          positionUnavailable: true,
        })
        break
      case 3: // TIMEOUT
        this.props.onGeolocationError(
          ERROR_COULD_NOT_GETLOCATION,
          this.props.geolocationFrom
        )
        searchPickupAddressByGeolocationEvent({
          dismissedGeolocation: true,
        })
        break
      default:
        return false
    }
  }

  handleGeolocationStatus = status => {
    this.props.onAskForGeolocationStatus(status, this.props.geolocationFrom)
  }

  handleAskForGeolocationButtonClick = () => {
    this.props.onAskForGeolocationStatus(WAITING, this.props.geolocationFrom)
  }

  handleManualGeolocation = () => {
    this.props.onManualGeolocation()
  }

  render() {
    const { intl, status } = this.props

    return (
      <div className="pkpmodal-locating-wrapper">
        {status === ASK && (
          <GeolocationStatus
            Image={() => (
              <div
                className="pkpmodal-locating-image-ask"
                onClick={this.handleAskForGeolocationButtonClick}
              >
                <PinGeolocation />
              </div>
            )}
            subtitleTop="geolocationAsk"
            titleTop="geolocationDiscover"
          >
            <div>
              <div className="pkpmodal-locating-automatic">
                <Button
                  kind="primary"
                  large
                  moreClassName="pkpmodal-locating-automatic-btn"
                  onClick={this.handleAskForGeolocationButtonClick}
                  title={translate(intl, 'askGeolocationAccept')}
                />
              </div>
              <div className="pkpmodal-locating-manual">
                <Button
                  kind="secondary"
                  moreClassName="pkpmodal-locating-manual-btn"
                  onClick={this.handleManualGeolocation}
                  title={translate(intl, 'geolocationManual')}
                />
              </div>
            </div>
          </GeolocationStatus>
        )}

        {status === WAITING && (
          <GeolocationStatus
            Image={() => (
              <div>
                <div className="pkpmodal-locating-image-waiting">
                  <PinWaiting />
                </div>
                <div className="pkpmodal-locating-image-waiting-shadow" />
              </div>
            )}
            subtitleBottom="geolocationAllow"
            titleBottom="geolocationWaiting"
          >
            <div className="pkpmodal-locating-manual">
              <Button
                kind="secondary"
                moreClassName="pkpmodal-locating-manual-btn"
                onClick={this.handleManualGeolocation}
                title={translate(intl, 'geolocationManual')}
              />
            </div>
          </GeolocationStatus>
        )}

        {status === SEARCHING && (
          <GeolocationStatus
            Image={() => (
              <div>
                <div className="pkpmodal-locating-image-searching">
                  <PinSearching />
                </div>
                <div className="pkpmodal-locating-image-searching-shadow" />
              </div>
            )}
            titleBottom="geolocationSearching"
          />
        )}
      </div>
    )
  }
}

AskForGeolocation.propTypes = {
  address: AddressShapeWithValidation,
  askForGeolocation: PropTypes.bool, // eslint-disable-line
  geolocationFrom: PropTypes.string,
  googleMaps: PropTypes.object,
  intl: intlShape,
  onAskForGeolocation: PropTypes.func.isRequired,
  onAskForGeolocationStatus: PropTypes.func.isRequired,
  onChangeAddress: PropTypes.func.isRequired,
  onGeolocationError: PropTypes.func.isRequired,
  onManualGeolocation: PropTypes.func.isRequired,
  pickupOptionGeolocations: PropTypes.array,
  rules: PropTypes.object,
  status: PropTypes.string.isRequired,
}

export default injectIntl(AskForGeolocation)
