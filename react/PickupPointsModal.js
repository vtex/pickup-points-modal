import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { withGoogleMaps } from './containers/withGoogleMaps'
import { translate } from './utils/i18nUtils'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import { newAddress } from './utils/newAddress'
import {
  HIDE_MAP,
  SHOW_MAP,
  WAITING,
  SEARCHING,
  OUTSIDE_MODAL,
  ERROR_NOT_FOUND,
  INSIDE_MODAL,
} from './constants'
import debounce from 'lodash/debounce'

import Map from './components/Map'
import PickupSidebar from './components/PickupSidebar'
import AskForGeolocation from './components/AskForGeolocation'
import Error from './components/Error'
import CloseButton from './components/CloseButton'
import Input from './components/Input'
import SearchForm from './components/SearchForm'
import { getPickupOptionGeolocations } from './utils/pickupUtils'
import { getPickupSlaString } from './utils/GetString'

import PinWaiting from './assets/components/PinWaiting'

import styles from './index.css'
import { helpers, shapes } from 'vtex.address-form'
import { getShipsTo } from './utils/AddressUtils'
import ZoomControls from './components/ZoomControls'

const { AddressShapeWithValidation } = shapes
const { validateField, addValidation } = helpers
const NULL_VALUE = {
  value: '',
}

class PickupPointsModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMounted: false,
      mapStatus: HIDE_MAP,
      isLargeScreen: window.innerWidth > 1023,
      selectedPickupPoint: props.selectedPickupPoint,
      isPickupDetailsActive: null,
      geolocationFrom: OUTSIDE_MODAL,
      showAskForGeolocation: props.askForGeolocation,
      askForGeolocationStatus: props.askForGeolocation ? WAITING : '',
      showError: false,
      errorStatus: '',
      showManualSearch:
        !props.askForGeolocation && props.pickupOptions.length === 0,
      shouldUseMaps: !!props.googleMapsKey,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const nextPickupOptions = getPickupSlaString(nextProps.pickupOptions)

    const hasGeocoordinates =
      get(nextProps.searchAddress, 'geoCoordinates.value') &&
      nextProps.searchAddress.geoCoordinates.value.length > 0

    const hasValidPostalCode = get(nextProps.searchAddress, 'postalCode.valid')

    const notSearchingAndIsEmptyPickupOptions =
      !nextProps.isSearching &&
      nextPickupOptions.length === 0 &&
      (!!nextProps.googleMapsKey ? hasGeocoordinates : hasValidPostalCode)

    const hasPickupsAndSearch = nextProps.googleMapsKey
      ? nextPickupOptions.length !== 0 && !nextProps.isSearching
      : !nextProps.isSearching

    this.setState({
      showAskForGeolocation: nextProps.isSearching,
      showManualSearch: this.state.showManualSearch
        ? hasPickupsAndSearch
        : false,
      askForGeolocationStatus: nextProps.isSearching ? SEARCHING : null,
      showError: notSearchingAndIsEmptyPickupOptions,
      errorStatus: notSearchingAndIsEmptyPickupOptions ? ERROR_NOT_FOUND : '',
      selectedPickupPoint: nextProps.selectedPickupPoint,
      shouldUseMaps: !!nextProps.googleMapsKey,
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      askForGeolocation,
      pickupOptions,
      searchAddress,
      selectedPickupPoint,
    } = this.props

    const {
      isPickupDetailsActive,
      mapStatus,
      isLargeScreen,
      showAskForGeolocation,
    } = this.state

    return (
      isPickupDetailsActive !== nextState.isPickupDetailsActive ||
      mapStatus !== nextState.mapStatus ||
      isLargeScreen !== nextState.isLargeScreen ||
      !isEqual(searchAddress, nextState.searchAddress) ||
      !isEqual(
        getPickupSlaString(pickupOptions),
        getPickupSlaString(nextProps.pickupOptions)
      ) ||
      selectedPickupPoint.id !== nextProps.selectedPickupPoint.id ||
      askForGeolocation !== nextProps.askForGeolocation ||
      showAskForGeolocation !== nextState.showAskForGeolocation
    )
  }

  componentWillUnmount() {
    this.setState({ isMounted: false })
    window.removeEventListener('resize', this.resize, true)
  }

  componentDidMount() {
    if (
      !!this.props.selectedPickupPoint &&
      this.state.isPickupDetailsActive === null
    ) {
      this.setState({
        isPickupDetailsActive: true,
        mapStatus: HIDE_MAP,
        isMounted: true,
      })
    } else {
      this.setState({
        isMounted: true,
      })
    }
    window.addEventListener('resize', this.resize)
  }

  setGeolocationFrom = () => {
    this.setState({
      geolocationFrom: INSIDE_MODAL,
    })
  }

  handleAskForGeolocation = (ask, geolocationFrom) => {
    this.setState({
      showAskForGeolocation: ask,
      showManualSearch: false,
      showError: false,
      ...(geolocationFrom ? { geolocationFrom: geolocationFrom } : {}),
    })
  }

  handleAskForGeolocationStatus = (status, geolocationFrom) => {
    this.setState({
      askForGeolocationStatus: status,
      showManualSearch: false,
      showError: false,
      ...(geolocationFrom ? { geolocationFrom: geolocationFrom } : {}),
    })
  }

  handleGeolocationError = (status, geolocationFrom) => {
    this.setState({
      showError: true,
      showAskForGeolocation: false,
      askForGeolocationStatus: null,
      errorStatus: status,
      ...(geolocationFrom ? { geolocationFrom: geolocationFrom } : {}),
    })
  }

  handleManualGeolocationError = () => {
    this.setState({
      showError: false,
      errorStatus: null,
      showManualSearch: true,
    })
  }

  handleManualGeolocation = () => {
    this.setState({
      showManualSearch: true,
      showAskForGeolocation: false,
      showError: false,
    })
  }

  resize = debounce(() => {
    if (!this.state.isMounted) return
    this.setState({
      isLargeScreen: window.innerWidth > 1023,
      mapStatus: window.innerWidth > 1023 ? SHOW_MAP : HIDE_MAP,
    })
  }, 200)

  updateLocationTab = mapStatus => this.setState({ mapStatus })

  changeActivePickupPointId = selectedPickupPoint =>
    this.setState({ selectedPickupPoint })

  togglePickupDetails = () =>
    this.setState({
      isPickupDetailsActive: !this.state.isPickupDetailsActive,
    })

  activatePickupDetails = () =>
    this.setState({
      isPickupDetailsActive: true,
      mapStatus: HIDE_MAP,
    })

  getPostalCodeValue = address => {
    // TODO move this to Address Form
    if (
      address &&
      address.country &&
      address.country.value === 'ARG' &&
      address.postalCode &&
      address.postalCode.value
    ) {
      const corePostalCode = address.postalCode.value.match(/([0-9]{4})/g)

      return (
        (corePostalCode.length > 0 && corePostalCode[0]) ||
        address.postalCode.value
      )
    }

    return address.postalCode && address.postalCode.value
  }

  getValidPostalCode = address => {
    if (address.postalCode) {
      const postalCodevalue = this.getPostalCodeValue(address)

      const validatedPostalCode = {
        value: postalCodevalue,
        ...validateField(
          postalCodevalue,
          'postalCode',
          address,
          this.props.rules
        ),
      }

      if (this.props.isAPIEnabled) {
        return {
          ...address.postalCode,
          ...(address.postalCode && validatedPostalCode.valid
            ? validatedPostalCode
            : NULL_VALUE),
        }
      }

      return {
        ...address.postalCode,
        value: validatedPostalCode && validatedPostalCode.value,
        valid: validatedPostalCode && validatedPostalCode.valid,
        visited: null,
      }
    }
    return NULL_VALUE
  }

  handleAddressChange = address => {
    const { searchAddress } = this.props

    const addressValidated = {
      ...addValidation(
        newAddress({
          ...address,
          country:
            searchAddress &&
            searchAddress.country &&
            searchAddress.country.value,
        })
      ),
      neighborhood: address.neighborhood || NULL_VALUE,
      number: address.number || NULL_VALUE,
      postalCode: this.getValidPostalCode(address),
    }

    this.props.onAddressChange(addressValidated)
  }

  render() {
    const {
      activePickupPoint,
      changeActivePickupDetails,
      changeActiveSLAOption,
      closePickupPointsModal,
      googleMaps,
      items,
      intl,
      logisticsInfo,
      loading,
      pickupOptions,
      pickupPoints,
      rules,
      searchAddress,
      sellerId,
      storePreferencesData,
    } = this.props

    const {
      askForGeolocationStatus,
      errorStatus,
      geolocationFrom,
      isLargeScreen,
      isPickupDetailsActive,
      mapStatus,
      selectedPickupPoint,
      showAskForGeolocation,
      showError,
      showManualSearch,
      shouldUseMaps,
    } = this.state

    const shouldShowFullPage =
      (showAskForGeolocation || showError) && geolocationFrom === OUTSIDE_MODAL

    const shouldShowMap =
      shouldUseMaps && (isLargeScreen || mapStatus === SHOW_MAP)

    const shouldShowZoomControls =
      !showAskForGeolocation || !showManualSearch || mapStatus === SHOW_MAP

    return (
      !loading && (
        <div>
          <div
            className={`${styles.modalBackdrop} pkpmodal-backdrop`}
            onClick={this.props.closePickupPointsModal}
          />
          <div className={`${styles.pkpmodal} pkpmodal`}>
            <CloseButton
              alt={translate(intl, 'closeButton')}
              onClickClose={this.props.closePickupPointsModal}
            />
            <ZoomControls shouldShow={shouldShowZoomControls} />
            {shouldShowMap && (
              <Map
                activatePickupDetails={this.activatePickupDetails}
                activePickupPoint={activePickupPoint}
                address={searchAddress}
                changeActivePickupDetails={changeActivePickupDetails}
                googleMaps={googleMaps}
                handleAskForGeolocation={this.onAskForGeolocation}
                isLargeScreen={isLargeScreen}
                isLoadingGoogle={loading}
                isPickupDetailsActive={isPickupDetailsActive}
                onChangeAddress={this.handleAddressChange}
                pickupOptionGeolocations={getPickupOptionGeolocations(
                  pickupOptions
                )}
                pickupOptions={pickupOptions}
                pickupPoint={selectedPickupPoint}
                rules={rules}
                selectedPickupPointGeolocation={getPickupOptionGeolocations(
                  selectedPickupPoint
                )}
              />
            )}

            {shouldShowFullPage ? (
              <div className={`${styles.modalfullPage} pkpmodal-full-page`}>
                {showAskForGeolocation && (
                  <AskForGeolocation
                    address={searchAddress}
                    askForGeolocation={showAskForGeolocation}
                    geolocationFrom={OUTSIDE_MODAL}
                    googleMaps={googleMaps}
                    onAskForGeolocation={this.handleAskForGeolocation}
                    onAskForGeolocationStatus={
                      this.handleAskForGeolocationStatus
                    }
                    onChangeAddress={this.handleAddressChange}
                    onGeolocationError={this.handleGeolocationError}
                    onManualGeolocation={this.handleManualGeolocation}
                    pickupOptionGeolocations={getPickupOptionGeolocations(
                      pickupOptions
                    )}
                    rules={rules}
                    status={askForGeolocationStatus}
                  />
                )}
                {showError && (
                  <Error
                    onManualGeolocationError={this.handleManualGeolocationError}
                    status={errorStatus}
                  />
                )}
              </div>
            ) : showManualSearch && (isLargeScreen || !shouldUseMaps) ? (
              <div className={`${styles.modalfullPage} pkpmodal-full-page`}>
                <div className={`${styles.searchAlone} pkpmodal-search-alone`}>
                  <PinWaiting />
                  <h2
                    className={`${
                      styles.searchAloneTitle
                    } pkpmodal-search-alone-title`}>
                    {translate(intl, 'geolocationEmpty')}
                  </h2>
                  <h3
                    className={`${
                      styles.searchAloneSubtitle
                    } pkpmodal-search-alone-subtitle`}>
                    {translate(
                      intl,
                      shouldUseMaps
                        ? 'geolocationEmptyInstructions'
                        : 'postalCodeEmptyInstructions'
                    )}
                  </h3>
                  <SearchForm
                    address={searchAddress}
                    autoFocus
                    googleMaps={googleMaps}
                    Input={Input}
                    insideModal={false}
                    isLoadingGoogle={loading}
                    isGeolocation={shouldUseMaps}
                    onAskForGeolocationStatus={
                      this.handleAskForGeolocationStatus
                    }
                    onChangeAddress={this.handleAddressChange}
                    onHandleAskForGeolocation={this.handleAskForGeolocation}
                    placeholder={translate(intl, 'searchLocationMap')}
                    rules={rules}
                    shipsTo={getShipsTo(intl, logisticsInfo)}
                  />
                </div>
              </div>
            ) : (
              <Fragment>
                <PickupSidebar
                  activePickupPoint={activePickupPoint}
                  askForGeolocationStatus={askForGeolocationStatus}
                  changeActivePickupDetails={changeActivePickupDetails}
                  changeActivePickupPointId={this.changeActivePickupPointId}
                  changeActiveSLAOption={changeActiveSLAOption}
                  closePickupPointsModal={closePickupPointsModal}
                  errorStatus={errorStatus}
                  geolocationFrom={geolocationFrom}
                  googleMaps={googleMaps}
                  isLargeScreen={isLargeScreen}
                  isLoading={loading}
                  isPickupDetailsActive={isPickupDetailsActive}
                  items={items}
                  logisticsInfo={logisticsInfo}
                  mapStatus={mapStatus}
                  onAskForGeolocation={this.handleAskForGeolocation}
                  onAskForGeolocationStatus={this.handleAskForGeolocationStatus}
                  onChangeAddress={this.handleAddressChange}
                  onGeolocationError={this.handleGeolocationError}
                  onHandleAddressChange={this.handleAddressChange}
                  onHandleAskForGeolocation={this.handleAskForGeolocation}
                  onManualGeolocation={this.handleManualGeolocation}
                  onManualGeolocationError={this.handleManualGeolocationError}
                  pickupOptions={pickupOptions}
                  pickupPoints={pickupPoints}
                  rules={rules}
                  searchAddress={searchAddress}
                  shouldUseMaps={shouldUseMaps}
                  selectedPickupPoint={selectedPickupPoint}
                  sellerId={sellerId}
                  setGeolocationFrom={this.setGeolocationFrom}
                  showAskForGeolocation={showAskForGeolocation}
                  showError={showError}
                  status={askForGeolocationStatus}
                  storePreferencesData={storePreferencesData}
                  togglePickupDetails={this.togglePickupDetails}
                  updateLocationTab={this.updateLocationTab}
                />
              </Fragment>
            )}
          </div>
        </div>
      )
    )
  }
}

PickupPointsModal.propTypes = {
  activePickupPoint: PropTypes.object,
  askForGeolocation: PropTypes.bool, // eslint-disable-line
  askForGeolocationStatus: PropTypes.string,
  changeActivePickupDetails: PropTypes.func.isRequired,
  changeActiveSLAOption: PropTypes.func.isRequired,
  closePickupPointsModal: PropTypes.func.isRequired,
  googleMaps: PropTypes.object,
  googleMapsKey: PropTypes.string,
  intl: intlShape,
  isSearching: PropTypes.bool,
  items: PropTypes.array.isRequired,
  loading: PropTypes.bool, // eslint-disable-line
  logisticsInfo: PropTypes.array.isRequired,
  onAddressChange: PropTypes.func.isRequired,
  pickupOptions: PropTypes.array.isRequired,
  pickupPoints: PropTypes.array.isRequired,
  rules: PropTypes.object,
  searchAddress: AddressShapeWithValidation,
  selectedPickupPoint: PropTypes.object,
  sellerId: PropTypes.string,
  storePreferencesData: PropTypes.object.isRequired,
}

export default injectIntl(withGoogleMaps(PickupPointsModal))
