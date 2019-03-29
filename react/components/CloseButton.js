import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './CloseButton.css'

export class CloseButton extends PureComponent {
  render() {
    const { onClickClose } = this.props

    return (
      <button className={`pkpmodal-close ${StyleSheet.close}`} onClick={onClickClose} type="button">
        <svg
          height="18"
          viewBox="0 0 16 16"
          width="18"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 2.5l-11 11M2.5 2.5l11 11" fill="none" stroke="#111" />
        </svg>
      </button>
    )
  }
}

CloseButton.propTypes = {
  onClickClose: PropTypes.func.isRequired,
}

export default CloseButton
