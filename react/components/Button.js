import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './Button.css'

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

    let style = `${moreClassName} ${styles.btn} pkp-modal-btn `

    switch (kind) {
      case 'secondary':
        style += `${styles.secondary} pkp-modal-btn-secondary `
        break

      default:
        style += `${styles.primary} pkp-modal-btn-primary `
        break
    }

    style += !inline ? `${styles.block} pkp-modal-btn-block ` : ''
    style += large ? `${styles.lg} pkp-modal-btn-lg ` : ''
    style += disabled ? `${styles.disabled} pkp-modal-btn-block ` : ''

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
