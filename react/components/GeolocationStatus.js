import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { translate } from '../utils/i18nUtils'
import styles from './GeolocationStatus.css'

class GeolocationStatus extends Component {
  render() {
    const {
      titleTop,
      subtitleTop,
      titleBottom,
      subtitleBottom,
      Image,
      children,
      intl,
    } = this.props

    return (
      <div className={`${styles.locating} pkpmodal-locating`}>
        <div className={`${styles.locatingContent} pkpmodal-locating-content`}>
          {titleTop && (
            <h2 className={`${styles.locatingTitle} pkpmodal-locating-title`}>
              {translate(intl, titleTop)}
            </h2>
          )}
          {subtitleTop && (
            <h3
              className={`${styles.locatingSubtitle} pkpmodal-locating-subtitle`}
            >
              {translate(intl, subtitleTop)}
            </h3>
          )}
          {Image && (
            <div className={`${styles.locatingImage} pkpmodal-locating-image`}>
              <Image />
            </div>
          )}
          {(titleBottom || subtitleBottom) && (
            <div
              className={`${styles.locatingInstructions} pkpmodal-locating-instructions`}
            >
              {titleBottom && (
                <h2
                  className={`${styles.locatingTitleSmall} pkpmodal-locating-title-small`}
                >
                  {translate(intl, titleBottom)}
                </h2>
              )}
              {subtitleBottom && (
                <h3
                  className={`${styles.locatingSubtitle} pkpmodal-locating-subtitle`}
                >
                  {translate(intl, subtitleBottom)}
                </h3>
              )}
            </div>
          )}
        </div>

        {children && (
          <div
            className={`${styles.locatingActions} pkpmodal-locating-actions`}
          >
            {children}
          </div>
        )}
      </div>
    )
  }
}

GeolocationStatus.propTypes = {
  Image: PropTypes.any,
  children: PropTypes.any,
  intl: intlShape.isRequired,
  subtitleBottom: PropTypes.any,
  subtitleTop: PropTypes.any,
  titleBottom: PropTypes.any,
  titleTop: PropTypes.any,
}

export default injectIntl(GeolocationStatus)
