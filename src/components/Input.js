import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'

export class Input extends Component {
  handleChange = event => this.props.onChange(event.target.value)

  render() {
    const { address, placeholder, onBlur, inputRef } = this.props

    const fieldValue = address.addressQuery

    return (
      <input
        type="text"
        className="input-reset f6 db w-100 br2 ba b--moon-gray light-silver input-xlarge"
        placeholder={placeholder}
        style={{
          boxSizing: 'border-box',
          padding: '.8rem 1rem',
        }}
        value={fieldValue.value || ''}
        onBlur={onBlur}
        onChange={this.handleChange}
        ref={inputRef}
        data-hj-whitelist
      />
    )
  }
}

Input.propTypes = {
  intl: intlShape,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  address: AddressShapeWithValidation,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  inputRef: PropTypes.func,
  googleMapsKey: PropTypes.string,
}

export default injectIntl(Input)
