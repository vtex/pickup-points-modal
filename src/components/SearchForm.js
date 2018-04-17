import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import GeolocationInput from '@vtex/address-form/lib/geolocation/GeolocationInput'
import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'

import {
  ASK,
  WAITING,
  GRANTED,
  INSIDE_MODAL,
} from '../constants'

import SearchIcon from '../assets/components/SearchIcon'
import GPS from '../assets/components/GPS'

import './SearchForm.css'

class SearchForm extends Component {
  onAskGeolocationClick = () => {
    navigator.permissions.query({ name: 'geolocation' }).then(permission => {
      this.props.onAskForGeolocationStatus(
        permission.state === GRANTED || process.env.NODE !== 'production'
          ? WAITING
          : ASK,
        INSIDE_MODAL
      )
      this.props.handleAskForGeolocation(true, INSIDE_MODAL)
    })
  }

  render() {
    const {
      Input,
      placeholder,
      loadingGoogle,
      googleMaps,
      address,
      rules,
      onChangeAddress,
      onFocus,
    } = this.props

    return (
      <form
        id="pkpmodal-search"
        className="pkpmodal-search"
        onSubmit={event => event.preventDefault()}
      >
        <GeolocationInput
          Input={Input}
          placeholder={placeholder}
          loadingGoogle={loadingGoogle}
          googleMaps={googleMaps}
          address={address}
          rules={rules}
          onChangeAddress={onChangeAddress}
          onFocus={onFocus}
        />
        {navigator.geolocation && (
          <button
            type="button"
            className="button-ask-geolocation btn btn-link"
            onClick={this.onAskGeolocationClick}
          >
            <GPS />
          </button>
        )}
        <SearchIcon />
      </form>
    )
  }
}

SearchForm.propTypes = {
  Input: PropTypes.node,
  placeholder: PropTypes.string,
  loadingGoogle: PropTypes.bool,
  googleMaps: PropTypes.object,
  address: AddressShapeWithValidation,
  rules: PropTypes.object,
  onChangeAddress: PropTypes.func,
  onFocus: PropTypes.func,
  handleAskForGeolocation: PropTypes.func.isRequired,
}

export default injectIntl(SearchForm)