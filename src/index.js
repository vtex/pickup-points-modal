import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { withGoogleMaps } from './containers/withGoogleMaps'
import { translate } from './utils/i18nUtils'
import isEqual from 'lodash/isEqual'
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

import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'
import Map from './components/Map'
import PickupSidebar from './components/PickupSidebar'
import AskForGeolocation from './components/AskForGeolocation'
import Error from './components/Error'
import CloseButton from './components/CloseButton'
import Input from './components/Input'
import SearchForm from './components/SearchForm'

import { validateField } from '@vtex/address-form/lib/validateAddress'
import { getPickupOptionGeolocations } from './utils/pickupUtils'
import { getPickupSlaString } from './utils/GetString'

import PinWaiting from './assets/components/PinWaiting'

import './index.css'

export class PickupPointsModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMounted: false,
      mapStatus: HIDE_MAP,
      isLargeScreen: window.innerWidth > 1023,
      selectedPickupPoint: props.selectedPickupPoint,
      isPickupDetailsActive: null,
      filteredPickupOptions: props.pickupOptions.filter(
        option =>
          props.activePickupPoint
            ? option.id !== props.activePickupPoint.id
            : true
      ),
      geolocationFrom: OUTSIDE_MODAL,
      showAskForGeolocation: props.askForGeolocation,
      askForGeolocationStatus: props.askForGeolocation ? WAITING : '',
      showError: false,
      errorStatus: '',
      showManualSearch:
        !props.askForGeolocation && props.pickupOptions.length === 0,
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    const nextPickupOptions = getPickupSlaString(nextProps.pickupOptions)

    const notSearchingAndIsEmptyPickupOptions =
      !nextProps.isSearching &&
      this.state.askForGeolocationStatus !== SEARCHING &&
      nextPickupOptions.length === 0

    this.setState({
      showAskForGeolocation: nextProps.isSearching,
      showManualSearch: this.state.showManualSearch
        ? nextPickupOptions.length !== 0 && !nextProps.isSearching
        : false,
      askForGeolocationStatus: nextProps.isSearching ? SEARCHING : null,
      showError: notSearchingAndIsEmptyPickupOptions,
      errorStatus: notSearchingAndIsEmptyPickupOptions ? ERROR_NOT_FOUND : '',
      selectedPickupPoint: nextProps.selectedPickupPoint,
      filteredPickupOptions: nextProps.pickupOptions.filter(
        option =>
          nextProps.activePickupPoint
            ? option.id !== nextProps.activePickupPoint.id
            : true
      ),
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      askForGeolocation,
      pickupOptions,
      searchAddress,
      selectedPickupPoint,
    } = this.props

    const { isPickupDetailsActive, mapStatus, isLargeScreen } = this.state

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
      askForGeolocation !== nextProps.askForGeolocation
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

  handleAddressChange = address => {
    if (address.postalCode && !address.postalCode.value) return
    const addressValidated = newAddress({
      ...address,
      neighbourhood: address.neighbourhood || {
        value: null,
      },
      number: address.number || {
        value: null,
      },
      postalCode: {
        ...address.postalCode,
        ...(address.postalCode
          ? {
              ...validateField(
                address.postalCode.value,
                'postalCode',
                address,
                this.props.rules
              ),
            }
          : {
              value: null,
            }),
      },
    })

    this.props.onAddressChange({
      ...addressValidated,
      postalCode: addressValidated.postalCode.valid
        ? addressValidated.postalCode
        : {
            value: null,
          },
    })
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
      rules,
      searchAddress,
      sellerId,
      storePreferencesData,
    } = this.props

    const {
      askForGeolocationStatus,
      errorStatus,
      filteredPickupOptions,
      geolocationFrom,
      isLargeScreen,
      isPickupDetailsActive,
      mapStatus,
      selectedPickupPoint,
      showAskForGeolocation,
      showError,
      showManualSearch,
    } = this.state

    return (
      <div>
        <div
          className="pkpmodal-backdrop"
          onClick={this.props.closePickupPointsModal}
        />
        <div className="pkpmodal">
          <CloseButton
            alt={translate(intl, 'closeButton')}
            onClickClose={this.props.closePickupPointsModal}
          />
          {(isLargeScreen || mapStatus === SHOW_MAP) && (
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

          {(showAskForGeolocation || showError) &&
          geolocationFrom === OUTSIDE_MODAL ? (
            <div className="pkpmodal-full-page">
              {showAskForGeolocation && (
                <AskForGeolocation
                  address={searchAddress}
                  askForGeolocation={showAskForGeolocation}
                  geolocationFrom={OUTSIDE_MODAL}
                  googleMaps={googleMaps}
                  onAskForGeolocation={this.handleAskForGeolocation}
                  onAskForGeolocationStatus={this.handleAskForGeolocationStatus}
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
          ) : showManualSearch && isLargeScreen ? (
            <div className="pkpmodal-full-page">
              <div className="pkpmodal-search-alone">
                <PinWaiting />
                <h2 className="pkpmodal-search-alone-title">
                  {translate(intl, 'geolocationEmpty')}
                </h2>
                <h3 className="pkpmodal-search-alone-subtitle">
                  {translate(intl, 'geolocationEmptyInstructions')}
                </h3>
                <SearchForm
                  address={searchAddress}
                  autoFocus
                  googleMaps={googleMaps}
                  Input={Input}
                  insideModal={false}
                  isLoadingGoogle={loading}
                  onAskForGeolocationStatus={this.handleAskForGeolocationStatus}
                  onChangeAddress={this.handleAddressChange}
                  onHandleAskForGeolocation={this.handleAskForGeolocation}
                  placeholder={translate(intl, 'searchLocationMap')}
                  rules={rules}
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
                filteredPickupOptions={filteredPickupOptions}
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
                rules={rules}
                searchAddress={searchAddress}
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
  googleMapsKey: PropTypes.string.isRequired,
  intl: intlShape,
  isSearching: PropTypes.bool,
  items: PropTypes.array.isRequired,
  loading: PropTypes.bool, // eslint-disable-line
  logisticsInfo: PropTypes.array.isRequired,
  onAddressChange: PropTypes.func.isRequired,
  pickupOptions: PropTypes.array.isRequired,
  rules: PropTypes.object,
  searchAddress: AddressShapeWithValidation,
  selectedPickupPoint: PropTypes.object,
  sellerId: PropTypes.string,
  storePreferencesData: PropTypes.object.isRequired,
}

export default injectIntl(withGoogleMaps(PickupPointsModal))
