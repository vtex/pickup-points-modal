import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Heading extends Component {
  render() {
    const { level, size, variation, margin, children } = this.props

    const thisLevel = level || 1
    const thisSize = size || 3

    let style = 'mt2 mb2 dib lh-title '

    style += margin ? 'mb2 ' : ''

    switch (thisSize) {
      case '4':
        style += 'f4 '
        break
      case '5':
        style += 'f5 '
        break
      case '6':
        style += 'f6 '
        break
      case '7':
        style += 'f7 '
        break
      default:
        style += 'f3 '
    }

    style += variation === 'uppercase' ? 'ttu ' : ''

    style += variation === 'bolder' ? 'fw7 silvers ' : 'fw5 '

    let Heading = {}

    switch (thisLevel) {
      case '1':
        Heading = <h1 className={style}>{children}</h1>
        break
      case '3':
        Heading = <h3 className={style}>{children}</h3>
        break
      case '4':
        Heading = <h4 className={style}>{children}</h4>
        break
      default:
        Heading = <h2 className={style}>{children}</h2>
    }

    return Heading
  }
}

Heading.propTypes = {
  level: PropTypes.string,
  size: PropTypes.string,
  variation: PropTypes.string,
  margin: PropTypes.bool,
  children: PropTypes.node,
}

export default Heading
