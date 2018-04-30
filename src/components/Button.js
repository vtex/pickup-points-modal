import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Button.css'

class Button extends Component {
  render() {
    const {
      kind,
      large,
      inline,
      disabled,
      title,
      moreClassName = '',
      ...rest
    } = this.props

    let style = `${moreClassName} pkp-modal-btn `

    switch (kind) {
      case 'secondary':
        style += 'pkp-modal-btn-secondary '
        break
      default:
        style += 'pkp-modal-btn-primary '
        break
    }

    style += !inline ? 'pkp-modal-btn-block ' : ''
    style += large ? 'pkp-modal-btn-lg ' : ''
    style += disabled ? 'pkp-modal-btn-disabled ' : ''

    return (
      <button className={style} disabled={disabled} {...rest} type="button">
        {title}
      </button>
    )
  }
}

Button.propTypes = {
  disabled: PropTypes.bool, // eslint-disable-line
  inline: PropTypes.bool, // eslint-disable-line
  kind: PropTypes.string,
  large: PropTypes.bool, // eslint-disable-line
  moreClassName: PropTypes.string,
  title: PropTypes.string,
}

export default Button
