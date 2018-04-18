import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import PinError from '../assets/components/PinError'

import './Error.css'

import GeolocationStatus from './GeolocationStatus'

export class Error extends Component {
  translate = id =>
    this.props.intl.formatMessage({
      id: `pickupPointsModal.${id}`,
    })

  render() {
    const { status, onManualGeolocationError } = this.props

    return (
      <div className="pkpmodal-locating-error">
        <GeolocationStatus
          titleBottom={status}
          subtitleBottom="useSearchBar"
          Image={() => (
            <div>
              <div className="pkpmodal-locating-error-image">
                <PinError />
              </div>
              <div className="pkpmodal-locating-error-image-shadow" />
            </div>
          )}
        >
          <div className="pkpmodal-locating-error-manual">
            <button
              type="button"
              onClick={onManualGeolocationError}
              className="pkpmodal-locating-error-manual-btn btn btn-success btn-large"
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
