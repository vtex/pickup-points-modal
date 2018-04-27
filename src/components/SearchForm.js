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
  onAskGeolocationClick = () => {
    navigator.permissions.query({ name: 'geolocation' }).then(permission => {
      this.props.onAskForGeolocationStatus(
        permission.state === GRANTED || process.env.NODE !== 'production'
          ? WAITING
          : ASK
      )
      this.props.handleAskForGeolocation(true)
    })
  }

  render() {
    const {
      Input,
      placeholder,
      loadingGoogle,
      intl,
      googleMaps,
      address,
      rules,
      onChangeAddress,
      setGeolocationFrom,
      autoFocus,
    } = this.props

    return (
      <form
        id="pkpmodal-search"
        className="pkpmodal-search"
        onSubmit={event => event.preventDefault()}
        onFocus={setGeolocationFrom}
      >
        <GeolocationInput
          Input={Input}
          placeholder={placeholder}
          loadingGoogle={loadingGoogle}
          googleMaps={googleMaps}
          address={address}
          rules={rules}
          autoFocus={autoFocus}
          onChangeAddress={onChangeAddress}
        />
        {navigator.geolocation && (
          <button
            title={translate(intl, 'askGeolocationAccept')}
            type="button"
            className="pkp-modal-ask-geolocation-btn"
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

SearchForm.defaultProps = {
  insideModal: true,
  autoFocus: false,
}

SearchForm.propTypes = {
  autoFocus: PropTypes.bool.isRequired,
  askForGeolocation: PropTypes.bool,
  Input: PropTypes.func,
  placeholder: PropTypes.string,
  loadingGoogle: PropTypes.bool,
  googleMaps: PropTypes.object,
  address: AddressShapeWithValidation,
  rules: PropTypes.object,
  setGeolocationFrom: PropTypes.func,
  onChangeAddress: PropTypes.func,
  handleAskForGeolocation: PropTypes.func.isRequired,
  onAskForGeolocationStatus: PropTypes.func.isRequired,
  intl: intlShape,
}

export default injectIntl(SearchForm)
