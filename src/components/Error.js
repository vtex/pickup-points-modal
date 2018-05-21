import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/i18nUtils'
import PinBlocked from '../assets/components/PinBlocked'
import PinLocationUnknown from '../assets/components/PinLocationUnknown'
import PinNoPickups from '../assets/components/PinNoPickups'

import './Error.css'

import GeolocationStatus from './GeolocationStatus'
import Button from './Button'
import {
  ERROR_NOT_ALLOWED,
  ERROR_COULD_NOT_GETLOCATION,
  ERROR_NOT_FOUND,
} from '../constants'

export class Error extends Component {
  getSubtitleString = () => {
    switch (this.props.status) {
      case ERROR_NOT_ALLOWED:
        return `${ERROR_NOT_ALLOWED}Subtitle`
      case ERROR_NOT_FOUND:
        return `${ERROR_NOT_FOUND}Subtitle`
      case ERROR_COULD_NOT_GETLOCATION:
        return `${ERROR_COULD_NOT_GETLOCATION}Subtitle`
      default: {
        return ''
      }
    }
  }
  render() {
    const { intl, status, onManualGeolocationError } = this.props
    const subtitleString = this.getSubtitleString()
    return (
      <div className="pkpmodal-locating-wrapper-error">
        <GeolocationStatus
          Image={() => (
            <div>
              <div className="pkpmodal-locating-error-image">
                {status === ERROR_NOT_ALLOWED && <PinBlocked />}
                {status === ERROR_NOT_FOUND && <PinNoPickups />}
                {status === ERROR_COULD_NOT_GETLOCATION && (
                  <PinLocationUnknown />
                )}
              </div>
            </div>
          )}
          subtitleBottom={subtitleString}
          titleBottom={status}
        >
          <div className="pkpmodal-locating-error-manual">
            <Button
              kind="primary"
              large
              moreClassName="pkpmodal-locating-error-manual-btn"
              onClick={onManualGeolocationError}
              title={translate(intl, 'geolocationManual')}
            />
          </div>
        </GeolocationStatus>
      </div>
    )
  }
}

Error.propTypes = {
  intl: intlShape,
  onManualGeolocationError: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
}

export default injectIntl(Error)
