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
      <div className={`pkpmodal-locating ${styles.locating}`}>
        <div className={`pkpmodal-locating-content ${styles.content}`}>
          {titleTop && (
            <h2 className={`pkpmodal-locating-title ${styles.title}`}>
              {translate(intl, titleTop)}
            </h2>
          )}
          {subtitleTop && (
            <h3 className={`pkpmodal-locating-subtitle ${styles.subtitle}`}>
              {translate(intl, subtitleTop)}
            </h3>
          )}
          {Image && (
            <div className={`pkpmodal-locating-image ${styles.image}`}>
              <Image />
            </div>
          )}
          {(titleBottom || subtitleBottom) && (
            <div className={`pkpmodal-locating-instructions ${styles.instructions}`}>
              {titleBottom && (
                <h2 className={`pkpmodal-locating-title-small ${styles.titleSmall}`}>
                  {translate(intl, titleBottom)}
                </h2>
              )}
              {subtitleBottom && (
                <h3 className={`pkpmodal-locating-subtitle ${styles.subtitle}`}>
                  {translate(intl, subtitleBottom)}
                </h3>
              )}
            </div>
          )}
        </div>

        {children && (
          <div className={`pkpmodal-locating-actions ${styles.actions}`}>{children}</div>
        )}
      </div>
    )
  }
}

GeolocationStatus.propTypes = {
  Image: PropTypes.any,
  children: PropTypes.any,
  intl: intlShape,
  subtitleBottom: PropTypes.any,
  subtitleTop: PropTypes.any,
  titleBottom: PropTypes.any,
  titleTop: PropTypes.any,
}

export default injectIntl(GeolocationStatus)
