import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import closebutton from '../assets/icons/close_icon.svg'

import './CloseButton.css'

export class CloseButton extends PureComponent {
  render() {
    const { onClickClose, alt } = this.props

    return (
      <button
        type="button"
        className={'pkpmodal-close btn btn-link'}
        onClick={onClickClose}
      >
        <img src={closebutton} alt={alt} />
      </button>
    )
  }
}

CloseButton.propTypes = {
  alt: PropTypes.string.isRequired,
  onClickClose: PropTypes.func.isRequired,
}

export default CloseButton
