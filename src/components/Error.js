import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import PinError from '../assets/components/PinError'

import './GeolocationStatus.css'

import GeolocationStatus from './GeolocationStatus'

export class Error extends Component {
  translate = id =>
    this.props.intl.formatMessage({
      id: `pickupPointsModal.${id}`,
    })

  render() {
    const { status, onManualGeolocationError } = this.props

    return (
      <div className="pkpmodal-ask-for-geolocation">
        <GeolocationStatus
          titleBottom={status}
          subtitleBottom="useSearchBar"
          Image={() => (
            <div>
              <div className="pkpmodal-ask-for-geolocation-image-waiting">
                <PinError />
              </div>
              <div className="pkpmodal-ask-for-geolocation-image-waiting-shadow" />
            </div>
          )}
        >
          <div className="pkpmodal-ask-for-geolocation-manual">
            <button
              type="button"
              onClick={onManualGeolocationError}
              className="btn-ask-for-geolocation-cta btn btn-success btn-large"
            >
              {this.translate('geolocationManual')}
            </button>
          </div>
        </GeolocationStatus>
      </div>
    )
  }
}

Error.propTypes = {
  intl: intlShape,
  status: PropTypes.string.isRequired,
  onManualGeolocationError: PropTypes.func.isRequired,
}

export default injectIntl(Error)
