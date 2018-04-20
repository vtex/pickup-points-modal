import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './CloseButton.css'

export class CloseButton extends PureComponent {
  render() {
    const { onClickClose } = this.props

    return (
      <button
        type="button"
        className="pkpmodal-close"
        onClick={onClickClose}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16">
          <path fill="none" stroke="#111" d="M13.5 2.5l-11 11M2.5 2.5l11 11" />
        </svg>
      </button>
    )
  }
}

CloseButton.propTypes = {
  onClickClose: PropTypes.func.isRequired,
}

export default CloseButton
