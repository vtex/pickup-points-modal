import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import UserGeolocation from '../components/UserGeolocation'
import GeolocationPin from '../assets/components/GeolocationPin'
import WaitingPin from '../assets/components/WaitingPin'
import SearchingPin from '../assets/components/SearchingPin'

import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'

import './AskForGeolocation.css'

import { WAITING, SEARCHING, ASK } from '../constants'

export class AskForGeolocation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      status: props.status || WAITING,
    }
  }

  handleGeolocationStatus = status => {
    this.setState({ status: status || WAITING })
  }

  handleManualGeolocation = () => {
    this.props.onAskForGeolocation(false)
  }

  translate = id =>
    this.props.intl.formatMessage({
      id: `pickupPointsModal.${id}`,
    })

  render() {
    const { status } = this.state

    return (
      <div className="pkpmodal-ask-for-geolocation">
        {status === ASK && (
          <div className="pkpmodal-ask-for-geolocation-wrapper pkpmodal-ask-for-geolocation-ask">
            <h2 className="pkpmodal-ask-for-geolocation-title">
              {this.translate('geolocationDiscover')}
            </h2>
            <h3 className="pkpmodal-ask-for-geolocation-subtitle">
              {this.translate('geolocationAsk')}
            </h3>
            <div className="pkpmodal-ask-for-geolocation-image-ask">
              <GeolocationPin />
            </div>
            <div className="pkpmodal-ask-for-geolocation-cta">
              <UserGeolocation
                address={this.props.address}
                pickupOptionGeolocations={this.props.pickupOptionGeolocations}
                googleMaps={this.props.googleMaps}
                onChangeAddress={this.props.onChangeAddress}
                onGetGeolocation={this.handleGeolocationStatus}
                handleAskForGeolocation={this.props.onAskForGeolocation}
                rules={this.props.rules}
              />
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
        )}

        {status === WAITING && (
          <div className="pkpmodal-ask-for-geolocation-wrapper pkpmodal-ask-for-geolocation-waiting">
            <div className="pkpmodal-ask-for-geolocation-image-waiting">
              <WaitingPin />
            </div>
            <div className="pkpmodal-ask-for-geolocation-image-waiting-shadow" />
            <div className="pkpmodal-ask-for-geolocation-instructions">
              <h2 className="pkpmodal-ask-for-geolocation-title-small">
                {this.translate('geolocationWaiting')}
              </h2>
              <h3 className="pkpmodal-ask-for-geolocation-subtitle">
                {this.translate('geolocationAllow')}
              </h3>
            </div>
          </div>
        )}

        {status === SEARCHING && (
          <div className="pkpmodal-ask-for-geolocation-wrapper pkpmodal-ask-for-geolocation-searching">
            <div className="pkpmodal-ask-for-geolocation-image-searching">
              <SearchingPin />
            </div>
            <div className="pkpmodal-ask-for-geolocation-image-searching-shadow" />
            <div className="pkpmodal-ask-for-geolocation-instructions">
              <h2 className="pkpmodal-ask-for-geolocation-title-small">
                {this.translate('geolocationSearching')}
              </h2>
            </div>
          </div>
        )}
      </div>
    )
  }
}

AskForGeolocation.propTypes = {
  address: AddressShapeWithValidation,
  googleMaps: PropTypes.object,
  intl: intlShape,
  onChangeAddress: PropTypes.func.isRequired,
  onAskForGeolocation: PropTypes.func.isRequired,
  pickupOptionGeolocations: PropTypes.array,
  rules: PropTypes.object,
}

export default injectIntl(AskForGeolocation)
