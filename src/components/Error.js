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
    const { status } = this.props

    let title

    switch (status) {
      case 'notFound':
        title = 'errorNotFound'
        break
      default:
        title = 'errorNotAllowed'
        break
    }

    return (
      <div className="pkpmodal-ask-for-geolocation">
        <GeolocationStatus
          titleBottom={title}
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
              onClick={this.handleManualGeolocation}
              className="btn-pkpmodal-ask-for-geolocation-manual btn btn-link"
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
}

export default injectIntl(Error)
