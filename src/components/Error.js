import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/i18nUtils'
import PinError from '../assets/components/PinError'

import './Error.css'

import GeolocationStatus from './GeolocationStatus'
import Button from './Button'

export class Error extends Component {
  render() {
    const { intl, status, onManualGeolocationError } = this.props

    return (
      <div className="pkpmodal-locating-wrapper-error">
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
            <Button
              kind="primary"
              large
              title={translate(intl, 'geolocationManual')}
              moreClassName="pkpmodal-locating-error-manual-btn"
              onClick={onManualGeolocationError}
            />
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
