import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/i18nUtils'
import GeolocationInput from '@vtex/address-form/lib/geolocation/GeolocationInput'
import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'

import { ASK, WAITING, GRANTED } from '../constants'

import SearchIcon from '../assets/components/SearchIcon'
import GPS from '../assets/components/GPS'

import './SearchForm.css'

class SearchForm extends Component {
  handleAskGeolocationClick = () => {
    navigator.permissions.query({ name: 'geolocation' }).then(permission => {
      this.props.onAskForGeolocationStatus(
        permission.state === GRANTED || process.env.NODE !== 'production'
          ? WAITING
          : ASK
      )
      this.props.onHandleAskForGeolocation(true)
    })
  }

  render() {
    const {
      Input,
      placeholder,
      isLoadingGoogle,
      intl,
      isAutoFocus,
      googleMaps,
      address,
      rules,
      onChangeAddress,
      setGeolocationFrom,
    } = this.props

    return (
      <form
        className="pkpmodal-search"
        id="pkpmodal-search"
        onFocus={setGeolocationFrom}
        onSubmit={event => event.preventDefault()}
      >
        <GeolocationInput
          address={address}
          autoFocus={isAutoFocus}
          googleMaps={googleMaps}
          Input={Input}
          isLoadingGoogle={isLoadingGoogle}
          onChangeAddress={onChangeAddress}
          placeholder={placeholder}
          rules={rules}
        />
        {navigator.geolocation && (
          <button
            className="pkp-modal-ask-geolocation-btn"
            onClick={this.handleAskGeolocationClick}
            title={translate(intl, 'askGeolocationAccept')}
            type="button"
          >
            <GPS />
          </button>
        )}
        <SearchIcon />
      </form>
    )
  }
}

SearchForm.defaultProps = {
  isAutoFocus: false,
}

SearchForm.propTypes = {
  Input: PropTypes.func,
  address: AddressShapeWithValidation,
  askForGeolocation: PropTypes.bool, // eslint-disable-line
  googleMaps: PropTypes.object,
  intl: intlShape,
  isAutoFocus: PropTypes.bool,
  isLoadingGoogle: PropTypes.bool,
  onAskForGeolocationStatus: PropTypes.func.isRequired,
  onChangeAddress: PropTypes.func,
  onHandleAskForGeolocation: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rules: PropTypes.object,
  setGeolocationFrom: PropTypes.func,
}

export default injectIntl(SearchForm)
