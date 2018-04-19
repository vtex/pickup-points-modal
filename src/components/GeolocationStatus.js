import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import './GeolocationStatus.css'

export class GeolocationStatus extends Component {
  translate = id =>
    this.props.intl.formatMessage({
      id: `pickupPointsModal.${id}`,
    })

  render() {
    const {
      titleTop,
      subtitleTop,
      titleBottom,
      subtitleBottom,
      Image,
      children,
    } = this.props

    return (
      <div className="pkpmodal-locating">
        <div className="pkpmodal-locating-content">
          {titleTop && (
            <h2 className="pkpmodal-locating-title">
              {this.translate(titleTop)}
            </h2>
          )}
          {subtitleTop && (
            <h3 className="pkpmodal-locating-subtitle">
              {this.translate(subtitleTop)}
            </h3>
          )}
          {Image && (
            <div className="pkpmodal-locating-image">
              <Image />
            </div>
          )}
          {(titleBottom || subtitleBottom) && (
            <div className="pkpmodal-locating-instructions">
              {titleBottom && (
                <h2 className="pkpmodal-locating-title-small">
                  {this.translate(titleBottom)}
                </h2>
              )}
              {subtitleBottom && (
                <h3 className="pkpmodal-locating-subtitle">
                  {this.translate(subtitleBottom)}
                </h3>
              )}
            </div>
          )}
        </div>

        {children && (
          <div className="pkpmodal-locating-actions">{children}</div>
        )}
      </div>
    )
  }
}

export default injectIntl(GeolocationStatus)
