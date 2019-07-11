import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import styles from './ZoomControls.css'
import { injectState } from '../modalStateContext'

class ZoomControls extends PureComponent {
  render() {
    const { shouldShow } = this.props

    return (
      <div className={`${styles.zoomWrapper} ${shouldShow ? '' : styles.hide}`}>
        <button className={`pkpmodal-zoom-in ${styles.zoomIn}`} type="button">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect
              x="8"
              y="18"
              width="18"
              height="2"
              rx="1"
              transform="rotate(-90 8 18)"
              fill="currentColor"
            />
            <rect y="8" width="18" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
        <hr className={styles.hr} />
        <button className={`pkpmodal-zoom-out ${styles.zoomOut}`} type="button">
          <svg
            width="18"
            height="2"
            viewBox="0 0 18 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect width="18" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
      </div>
    )
  }
}

ZoomControls.propTypes = {
  shouldShow: PropTypes.bool,
}

export default injectState(ZoomControls)
