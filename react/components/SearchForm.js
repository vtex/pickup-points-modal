import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import { components, inputs, shapes } from 'vtex.address-form'
import { injectIntl, intlShape } from 'react-intl'

import SearchIcon from '../assets/components/SearchIcon'
import Gps from '../assets/components/GPS'
import GPSDenied from '../assets/components/GPSDenied'
import styles from './SearchForm.css'
import { hasPostalCodeOnlyNumber } from '../utils/AddressUtils'
import { translate } from '../utils/i18nUtils'
import { DENIED } from '../constants'
import { injectGeolocation } from '../geolocationContext'

const { PostalCodeGetter, CountrySelector } = components
const { GeolocationInput, DefaultInput } = inputs
const { AddressShapeWithValidation } = shapes

class SearchForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMyLocationButtonVisible: true,
      address: this.props.address,
    }
  }

  setMyLocationButtonVisibility = (visibility) => {
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

  handleGeolocationClick = () => {
    const { permissionStatus } = this.props

    if (navigator.geolocation && permissionStatus === DENIED) return

    this.props.getCurrentPosition()
  }

  handleAddressChange = (address) => {
    this.setState((prevState) => ({
      address: {
        ...prevState.address,
        ...address,
      },
    }))

    if (address.postalCode.value) {
      this.props.onChangeAddress({ ...this.state.address, ...address })
    }
  }

  render() {
    const {
      googleMaps,
      Input,
      intl,
      isAutoFocus,
      isGeolocation,
      isLargeScreen,
      isLoadingGoogle,
      isLoadingGeolocation,
      isSidebar,
      rules,
      placeholder,
      setGeolocationFrom,
      shipsTo,
      permissionStatus,
    } = this.props

    const { address } = this.state

    const geolocationStyle = `${styles.askGeolocationBtn} pkp-modal-ask-geolocation-btn`

    const postalCodeStyle = `${styles.askGeolocationBtn} ${styles.askGeolocationBtnPostalCode} pkp-modal-ask-geolocation-btn postal-code`

    return (
      <form
        className={`${
          isGeolocation ? styles.modalSearch : styles.modalPostalCode
        } ${isGeolocation ? 'pkpmodal-search' : 'pkpmodal-postal-code'} ${
          isSidebar ? '' : 'full'
        }`}
        id="pkpmodal-search"
        onFocus={setGeolocationFrom}
        onSubmit={(event) => event.preventDefault()}
      >
        {isGeolocation ? (
          <GeolocationInput
            address={address}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={isAutoFocus}
            googleMaps={googleMaps}
            Input={Input}
            inputProps={{
              onBlur: this.handleInputBlur,
              onFocus: this.handleInputFocus,
            }}
            isLoadingGoogle={isLoadingGoogle}
            onChangeAddress={this.handleAddressChange}
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
                onChangeAddress={this.handleAddressChange}
                shipsTo={shipsTo}
              />
            )}
            <PostalCodeGetter
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              address={address}
              Input={DefaultInput}
              onChangeAddress={this.handleAddressChange}
              rules={rules}
              inputProps={{
                onBlur: this.handleInputBlur,
                onFocus: this.handleInputFocus,
              }}
              shouldShowNumberKeyboard={hasPostalCodeOnlyNumber(rules.mask)}
            />
          </Fragment>
        )}
        {
          <Fragment>
            <button
              data-tip
              data-for="GPSDenied"
              data-event={isLargeScreen ? 'mouseover' : 'click'}
              className={`${
                isGeolocation ? geolocationStyle : postalCodeStyle
              } ${isLoadingGeolocation ? styles.isLoadingGeolocation : ''}`}
              onClick={this.handleGeolocationClick}
              title={translate(intl, 'askGeolocationAccept')}
              type="button"
            >
              {navigator.geolocation && permissionStatus !== DENIED ? (
                <Gps />
              ) : (
                <GPSDenied />
              )}
            </button>
            {(!navigator.geolocation || permissionStatus === DENIED) && (
              <ReactTooltip
                globalEventOff={isLargeScreen ? 'mouseout' : 'click'}
                id="GPSDenied"
                effect={isLargeScreen ? 'float' : 'solid'}
              >
                <span>{translate(intl, 'askGeolocationDenied')}</span>
              </ReactTooltip>
            )}
          </Fragment>
        }
        {isGeolocation && <SearchIcon isGeolocation={isGeolocation} />}
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
  getCurrentPosition: PropTypes.func,
  intl: intlShape.isRequired,
  isAutoFocus: PropTypes.bool,
  isGeolocation: PropTypes.bool,
  isLargeScreen: PropTypes.bool,
  isLoadingGeolocation: PropTypes.bool,
  isLoadingGoogle: PropTypes.bool,
  isSidebar: PropTypes.bool,
  onChangeAddress: PropTypes.func,
  placeholder: PropTypes.string,
  permissionStatus: PropTypes.string,
  rules: PropTypes.object,
  setActiveState: PropTypes.func,
  setGeolocationStatus: PropTypes.func,
  setGeolocationFrom: PropTypes.func,
  status: PropTypes.string,
  shipsTo: PropTypes.array,
}

export default injectGeolocation(injectIntl(SearchForm))
