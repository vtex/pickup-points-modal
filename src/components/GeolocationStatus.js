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
    } = this.props

    return (
      <div className="pkpmodal-ask-for-geolocation">
        <div className="pkpmodal-ask-for-geolocation-wrapper pkpmodal-ask-for-geolocation-ask">
          {titleTop && (
            <h2 className="pkpmodal-ask-for-geolocation-title">
              {this.translate(titleTop)}
            </h2>
          )}
          {subtitleTop && (
            <h3 className="pkpmodal-ask-for-geolocation-subtitle">
              {this.translate(subtitleTop)}
            </h3>
          )}
          {Image && <Image />}
          {(titleBottom || subtitleBottom) && (
            <div className="pkpmodal-ask-for-geolocation-instructions">
              {titleBottom && (
                <h2 className="pkpmodal-ask-for-geolocation-title-small">
                  {this.translate(titleBottom)}
                </h2>
              )}
              {subtitleBottom && (
                <h3 className="pkpmodal-ask-for-geolocation-subtitle">
                  {this.translate(subtitleBottom)}
                </h3>
              )}
              {this.props.children}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default injectIntl(GeolocationStatus)
