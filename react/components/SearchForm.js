import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/i18nUtils'
import { hasPostalCodeOnlyNumber } from '../utils/AddressUtils'
import { ASK, WAITING, GRANTED, VTEXLOCAL, LOCALHOST } from '../constants'
import SearchIcon from '../assets/components/SearchIcon'
import Gps from '../assets/components/GPS'
import styles from './SearchForm.css'
import { components, inputs, shapes } from 'vtex.address-form'

const { PostalCodeGetter, CountrySelector } = components
const { GeolocationInput, DefaultInput } = inputs
const { AddressShapeWithValidation } = shapes

class SearchForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMyLocationButtonVisible: true,
    }
  }

  setMyLocationButtonVisibility = visibility => {
    this.setState({
      isMyLocationButtonVisible: visibility,
    })
  }

  handleInputBlur = () => {
    this.setMyLocationButtonVisibility(true)
  }

  handleInputFocus = () => {
    this.setMyLocationButtonVisibility(false)
  }

  handleAskGeolocationClick = () => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(permission => {
        this.props.onAskForGeolocationStatus(
          permission.state === GRANTED || process.env.NODE !== 'production'
            ? WAITING
            : ASK
        )
        this.props.onHandleAskForGeolocation(true)
      })
    } else if (
      window.location.host.indexOf(VTEXLOCAL) !== -1 ||
      window.location.host.indexOf(LOCALHOST) !== -1
    ) {
      this.props.onHandleAskForGeolocation(true)
    } else {
      this.props.onAskForGeolocationStatus(WAITING)
      this.props.onHandleAskForGeolocation(true)
    }
  }

  render() {
    const {
      Input,
      placeholder,
      isLoadingGoogle,
      intl,
      isGeolocation,
      isAutoFocus,
      googleMaps,
      address,
      rules,
      onChangeAddress,
      setGeolocationFrom,
      shipsTo,
    } = this.props

    return (
      <form
        className={`${styles.modalSearch} pkpmodal-search`}
        id="pkpmodal-search"
        onFocus={setGeolocationFrom}
        onSubmit={event => event.preventDefault()}>
        {isGeolocation ? (
          <GeolocationInput
            address={address}
            autoFocus={isAutoFocus}
            googleMaps={googleMaps}
            Input={Input}
            inputProps={{
              onBlur: this.handleInputBlur,
              onFocus: this.handleInputFocus,
            }}
            isLoadingGoogle={isLoadingGoogle}
            onChangeAddress={onChangeAddress}
            placeholder={placeholder}
            rules={rules}
            useSearchBox
          />
        ) : (
          <Fragment>
            {shipsTo.length > 1 && (
              <CountrySelector
                address={address}
                Input={DefaultInput}
                onChangeAddress={onChangeAddress}
                shipsTo={shipsTo}
              />
            )}
            <PostalCodeGetter
              autoFocus
              address={address}
              Input={DefaultInput}
              onChangeAddress={onChangeAddress}
              rules={rules}
              inputProps={{
                onBlur: this.handleInputBlur,
                onFocus: this.handleInputFocus,
              }}
              shouldShowNumberKeyboard={hasPostalCodeOnlyNumber(rules.mask)}
            />
          </Fragment>
        )}
        {navigator.geolocation &&
          this.state.isMyLocationButtonVisible && (
          <button
            className={
              isGeolocation
                ? `${styles.askGeolocationBtn} pkp-modal-ask-geolocation-btn`
                : `${styles.askGeolocationBtn} ${
                  styles.askGeolocationBtnPostalCode
                } pkp-modal-ask-geolocation-btn postal-code`
            }
            onClick={this.handleAskGeolocationClick}
            title={translate(intl, 'askGeolocationAccept')}
            type="button">
            <Gps />
          </button>
        )}
        <SearchIcon isGeolocation={isGeolocation} />
      </form>
    )
  }
}

SearchForm.defaultProps = {
  isAutoFocus: false,
  isGeolocation: true,
}

SearchForm.propTypes = {
  Input: PropTypes.func,
  address: AddressShapeWithValidation,
  askForGeolocation: PropTypes.bool, // eslint-disable-line
  googleMaps: PropTypes.object,
  intl: intlShape,
  isAutoFocus: PropTypes.bool,
  isGeolocation: PropTypes.bool,
  isLoadingGoogle: PropTypes.bool,
  onAskForGeolocationStatus: PropTypes.func.isRequired,
  onChangeAddress: PropTypes.func,
  onHandleAskForGeolocation: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rules: PropTypes.object,
  setGeolocationFrom: PropTypes.func,
  shipsTo: PropTypes.array,
}

export default injectIntl(SearchForm)
