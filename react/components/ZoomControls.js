import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import PlusIcon from '../assets/icons/plus_icon.svg'
import MinusIcon from '../assets/icons/minus_icon.svg'
import styles from './ZoomControls.css'
import { SIDEBAR } from '../constants'
import { injectState } from '../modalStateContext'

class ZoomControls extends PureComponent {
  render() {
    const { shouldShow, activeState } = this.props

    return (
      <div
        className={`${styles.zoomWrapper} ${
          shouldShow && activeState === SIDEBAR ? '' : styles.hide
        }`}>
        <button className={`pkpmodal-zoom-in ${styles.zoomIn}`} type="button">
          <img src={PlusIcon} />
        </button>
        <hr className={styles.hr} />
        <button className={`pkpmodal-zoom-out ${styles.zoomOut}`} type="button">
          <img src={MinusIcon} />
        </button>
      </div>
    )
  }
}

ZoomControls.propTypes = {
  shouldShow: PropTypes.bool,
}

export default injectState(ZoomControls)
