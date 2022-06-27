import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import styles from './CloseButton.css'

class CloseButton extends PureComponent {
  render() {
    const { onClickClose } = this.props

    return (
      <button
        className={`${styles.closeButton} pkpmodal-close`}
        onClick={onClickClose}
        type="button"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.0341797"
            y="12.4351"
            width="17.8693"
            height="2"
            rx="1"
            transform="rotate(-45 0.0341797 12.4351)"
            fill="currentColor"
          />
          <rect
            x="1.41422"
            width="17.8693"
            height="2"
            rx="1"
            transform="rotate(45 1.41422 0)"
            fill="currentColor"
          />
        </svg>
      </button>
    )
  }
}

CloseButton.propTypes = {
  onClickClose: PropTypes.func.isRequired,
}

export default CloseButton
